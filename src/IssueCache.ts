interface CacheInterface {
    [key: string]: any;
}

class IssueCache {
    cache: CacheInterface = {};
    onAdd: CacheInterface = {};

    add(key: string, value: any): void {
        this.cache = Object.assign(this.cache || {}, {
            [key]: value,
        });

        if (this.onAdd?.[key]) {
            this.onAdd[key](value);
        }
    }

    get(key: string) {
        return this.cache[key];
    }

    delete(key: string): void {
        delete this.cache[key];
    }

    exists(key: string): boolean {
        return !!this.cache?.[key];
    }

    whenAvailable(key: string, fn: (value: any) => void): void {
        this.onAdd = Object.assign(this.onAdd || {}, {
            [key]: fn,
        });
    }
}

export default IssueCache;