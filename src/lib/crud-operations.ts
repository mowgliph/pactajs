import { createPostgrestClient } from "./postgrest";
import { validateEnv } from "./api-utils";

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public code?: string, public statusCode: number = 500) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Type for filter values supporting both simple and advanced operators
 */
type FilterValue = any | { operator: string; value: any };

/**
 * Utility class for common CRUD operations with PostgREST
 */
export default class CrudOperations {
  private client: ReturnType<typeof createPostgrestClient>;

  constructor(private tableName: string, private authToken?: string) {
    this.client = createPostgrestClient(this.authToken);
  }

  /**
   * Fetches multiple records with optional filtering, sorting, and pagination
   */
  async findMany(
    filters?: Record<string, FilterValue>,
    params?: {
      limit?: number;
      offset?: number;
      orderBy?: {
        column: string;
        direction: "asc" | "desc";
      };
    },
  ) {
    validateEnv();
    const { limit, offset, orderBy } = params || {};

    let query = this.client
      .from(this.tableName)
      .select("*")

    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.direction === "asc",
      });
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && value !== null && 'operator' in value && 'value' in value) {
            // Advanced filter with operator
            const { operator, value: val } = value;
            switch (operator) {
              case 'eq':
                query = query.eq(key, val);
                break;
              case 'neq':
                query = query.neq(key, val);
                break;
              case 'gt':
                query = query.gt(key, val);
                break;
              case 'lt':
                query = query.lt(key, val);
                break;
              case 'gte':
                query = query.gte(key, val);
                break;
              case 'lte':
                query = query.lte(key, val);
                break;
              case 'like':
                query = query.like(key, val);
                break;
              case 'ilike':
                query = query.ilike(key, val);
                break;
              case 'in':
                query = query.in(key, val);
                break;
              default:
                throw new ValidationError(`Unsupported filter operator: ${operator}`);
            }
          } else {
            // Simple filter, default to eq for backward compatibility
            query = query.eq(key, value);
          }
        }
      });
    }

    if (limit && offset !== undefined) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Database error in findMany for ${this.tableName}: ${error.message}`, { code: error.code, details: error.details });
      throw new DatabaseError(`Failed to fetch ${this.tableName}: ${error.message}`, error.code);
    }

    return data;
  }

  /**
   * Fetches a single record by its ID
   */
  async findById(id: string | number) {
    validateEnv();

    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error(`Database error in findById for ${this.tableName} with id ${id}: ${error.message}`, { code: error.code, details: error.details });
      throw new DatabaseError(
        `Failed to fetch ${this.tableName} by id: ${error.message}`,
        error.code
      );
    }

    return data;
  }

  /**
   * Creates a new record in the table
   */
  async create(data: Record<string, any>) {
    validateEnv();
      
    const res = await this.client
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    const { data: result, error } = res;

    if (error) {
      console.error(`Database error in create for ${this.tableName}: ${error.message}`, { code: error.code, details: error.details, data });
      throw new DatabaseError(`Failed to create ${this.tableName}: ${error.message}`, error.code);
    }

    return result;
  }

  /**
   * Updates an existing record by ID
   */
  async update(
    id: string | number,
    data: Record<string, any>
  ) {
    validateEnv();

    const { data: result, error } = await this.client
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Database error in update for ${this.tableName} with id ${id}: ${error.message}`, { code: error.code, details: error.details, data });
      throw new DatabaseError(`Failed to update ${this.tableName}: ${error.message}`, error.code);
    }

    return result;
  }

  /**
   * Deletes a record by ID
   */
  async delete(id: string | number) {
    validateEnv();

    const { error } = await this.client.from(this.tableName).delete().eq("id", id);

    if (error) {
      console.error(`Database error in delete for ${this.tableName} with id ${id}: ${error.message}`, { code: error.code, details: error.details });
      throw new DatabaseError(`Failed to delete ${this.tableName}: ${error.message}`, error.code);
    }

    return { id };
  }
}