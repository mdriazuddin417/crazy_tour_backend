/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>

    private searchFilter: any = {};
    private mainFilter: any = {};

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
        // 🔥 FIX: Save initial Mongoose filter
        this.mainFilter = { ...(modelQuery.getFilter?.() || {}) };
    }

    filter(): this {
        const filter = { ...this.query };

        for (const field of excludeField) {
            delete filter[field];
        }

        this.mainFilter = { ...this.mainFilter, ...filter };

        this.modelQuery = this.modelQuery.find(this.mainFilter);
        return this;
    }

    search(searchableField: string[]): this {
        const searchTerm = this.query.searchTerm || "";

        if (searchTerm) {
            this.searchFilter = {
                $or: searchableField.map(field => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };

            this.modelQuery = this.modelQuery.find(this.searchFilter);
        }

        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    fields(): this {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    build() {
        return this.modelQuery;
    }

    async getMeta() {
        const finalFilter = {
            ...this.mainFilter,
            ...this.searchFilter,
        };

        const totalDocuments = await this.modelQuery.model.countDocuments(finalFilter);

        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const totalPage = Math.ceil(totalDocuments / limit);

        return { page, limit, total: totalDocuments, totalPage };
    }
}
