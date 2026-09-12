"""Single-process, bounded memory store. No persistence or cross-owner lookups."""
import time
import uuid
from dataclasses import dataclass, field

from chatkit.store import Store, NotFoundError
from chatkit.types import Page, ThreadMetadata


class OwnershipError(Exception):
    pass


class CapacityError(Exception):
    pass


@dataclass
class Record:
    owner: str
    thread: ThreadMetadata
    expires: float
    items: list = field(default_factory=list)


class MemoryStore(Store[str]):
    def __init__(self, ttl=1800, clock=time.monotonic):
        self.records: dict[str, Record] = {}
        self.ttl, self.clock = ttl, clock

    def purge(self):
        now = self.clock()
        for key in [k for k, v in self.records.items() if v.expires <= now]:
            del self.records[key]

    def record(self, thread_id, context):
        self.purge()
        record = self.records.get(thread_id)
        if record is None:
            raise NotFoundError("Conversation expired. Start a new chat.")
        if record.owner != context:
            raise OwnershipError("Conversation unavailable.")
        return record

    def generate_thread_id(self, context):
        return "thr_" + uuid.uuid4().hex

    async def load_thread(self, thread_id, context):
        return self.record(thread_id, context).thread.model_copy(deep=True)

    async def save_thread(self, thread, context):
        self.purge()
        if thread.id in self.records:
            record = self.record(thread.id, context)
            record.thread = thread.model_copy(deep=True)
        else:
            if len(self.records) >= 200 or sum(r.owner == context for r in self.records.values()) >= 10:
                raise CapacityError("Too many conversations. Wait for older chats to expire.")
            self.records[thread.id] = Record(context, thread.model_copy(deep=True), self.clock() + self.ttl)

    @staticmethod
    def page(values, after, limit, order):
        values = sorted(values, key=lambda v: (v.created_at.timestamp(), v.id), reverse=order == "desc")
        if after:
            ids = [v.id for v in values]
            if after not in ids:
                raise NotFoundError("Page unavailable")
            values = values[ids.index(after) + 1:]
        limit = max(1, min(limit or 20, 100))
        selected = values[:limit]
        return Page(data=[v.model_copy(deep=True) for v in selected], has_more=len(values) > limit,
                    after=selected[-1].id if len(values) > limit else None)

    async def load_thread_items(self, thread_id, after, limit, order, context):
        return self.page(self.record(thread_id, context).items, after, limit, order)

    async def load_threads(self, limit, after, order, context):
        self.purge()
        return self.page([r.thread for r in self.records.values() if r.owner == context], after, limit, order)

    async def add_thread_item(self, thread_id, item, context):
        await self.save_item(thread_id, item, context)

    async def save_item(self, thread_id, item, context):
        record = self.record(thread_id, context)
        if item.thread_id != thread_id:
            raise OwnershipError("Conversation unavailable")
        for i, previous in enumerate(record.items):
            if previous.id == item.id:
                record.items[i] = item.model_copy(deep=True)
                return
        if len(record.items) >= 100:
            raise CapacityError("This conversation is full. Start a new chat.")
        record.items.append(item.model_copy(deep=True))

    async def load_item(self, thread_id, item_id, context):
        for item in self.record(thread_id, context).items:
            if item.id == item_id:
                return item.model_copy(deep=True)
        raise NotFoundError("Message unavailable")

    async def delete_thread(self, thread_id, context):
        self.record(thread_id, context)
        del self.records[thread_id]

    async def delete_thread_item(self, thread_id, item_id, context):
        record = self.record(thread_id, context)
        await self.load_item(thread_id, item_id, context)
        record.items = [item for item in record.items if item.id != item_id]

    async def save_attachment(self, attachment, context):
        raise OwnershipError("Attachments are disabled")

    async def load_attachment(self, attachment_id, context):
        raise OwnershipError("Attachments are disabled")

    async def delete_attachment(self, attachment_id, context):
        raise OwnershipError("Attachments are disabled")
