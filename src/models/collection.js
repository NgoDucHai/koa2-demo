const redis = require('promise-redis')();
const db = redis.createClient();

class Collection {
    async count() {
        let count = await db
            .zcount(this.name, '-inf', '+inf');
        return Number(count);
    }

    async add(event) {
        await db
            .add(this.name, 1, JSON.stringify(event));

        await this._incrGroups(event);
    }

    async _incrGroups(event) {
        const promises = this.groupBy.map(attr =>
            db.hincrby(`${this.name}_by_${attr}`, event[attr], 1));
        await Promise.all(promises);
    }
}

export default Collection;