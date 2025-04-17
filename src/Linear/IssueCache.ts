import { openDB } from "idb";

interface CacheInterface {
    [key: string]: any;
}

class IssueCache {
    cache: CacheInterface = {};
    onAdd: CacheInterface = {};

    private async db() {
        return openDB('linear-issues', 2, {
            upgrade(db) {
                // Create a store of objects
                const store = db.createObjectStore('issues', {
                  keyPath: 'identifier',
                });
                // Create an index on the 'date' property of the objects.
                // store.createIndex('date', 'date');
            },
        })
    }

    async add(key: string, value: any) {
        const db = await this.db();
        db.put('issues', value);

        if (this.onAdd?.[key]) {
            this.onAdd[key](value);
        }
    }

    async get(key: string) {
        const db = await this.db();
        return (await db.get('issues', key)) || {};
    }

    async delete(key: string) {
        const db = await this.db();
        return (await db.delete('issues', key));
    }

    async exists(key: string) {
        const db = await this.db();
        const data = await db.get('issues', key);

        return !!data;
    }

    whenAvailable(key: string, fn: (value: any) => void): void {
        this.onAdd = Object.assign(this.onAdd || {}, {
            [key]: fn,
        });
    }
}

export default IssueCache;