import { openDB } from "idb";
import { Plugin } from "obsidian";
import { S_IN_MS } from "Utils/constants";

interface CacheInterface {
    [key: string]: any;
}

enum CacheTables {
    Issues = 'issues'
}

class Cache {
    protected DATABASE_NAME = 'plugin/linear';
    protected CACHE_TIME = 20; // Seconds
    onAdd: CacheInterface = {};

    private async db() {
        return openDB(this.DATABASE_NAME + `/${CacheHash}`, 1, {
            upgrade(db) {
                // Create a store of objects
                const store = db.createObjectStore(CacheTables.Issues, {
                  keyPath: 'identifier',
                });
                // Create an index on the 'date' property of the objects.
                store.createIndex('expiry', 'cacheExpiry');
            },
        })
    }

    async add(key: string, value: any) {
        value.cacheExpiry = Date.now() + (this.CACHE_TIME * S_IN_MS);

        const db = await this.db();
        db.put(CacheTables.Issues, value);

        if (this.onAdd?.[key]) {
            this.onAdd[key](value);
        }
    }

    async get(key: string) {
        const db = await this.db();
        return (await db.get(CacheTables.Issues, key)) || {};
    }

    async delete(key: string) {
        const db = await this.db();
        return (await db.delete(CacheTables.Issues, key));
    }

    async exists(key: string, forceCache = false) {
        const db = await this.db();
        const data = await db.get(CacheTables.Issues, key);

        if (!data) {
            return false;
        }

        // Cache time expired so pretend it doesn't exist.
        if (data.cacheExpiry < Date.now() && !forceCache) {
            return false;
        }

        return true;
    }

    whenAvailable(key: string, fn: (value: any) => void): void {
        this.onAdd = Object.assign(this.onAdd || {}, {
            [key]: fn,
        });
    }

    async expired() {
        const db = await this.db();
        const issues = await db.getAllFromIndex(CacheTables.Issues, 'expiry');
        const expiry = Date.now();
        return issues.filter(issue => issue.cacheExpiry < expiry);
    }
}

export default Cache;