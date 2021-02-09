// import JsonPointer from 'json-pointer';
import { TransactionDto } from '../dtos/transaction-dto';
import HttpException from '../exceptions/http-exception';
import ConnectionPoolService from './connection-pool-service';

export default class DbService {
  private connectionPool = new ConnectionPoolService();

  // Updates a keys value, else creates new key-value
  async update(trx: TransactionDto): Promise<void> {
    const conn = await this.connectionPool.get(trx.namespace);
    await conn.set(trx.key, trx.value);
  }

  // Remove a key and its value
  async remove(trx: TransactionDto): Promise<void> {
    const conn = await this.connectionPool.get(trx.namespace);
    await conn.delete(trx.key);
  }

  // Select a value by key / jsonpath
  async select(trx: TransactionDto): Promise<JSON> {
    const conn = await this.connectionPool.get(trx.namespace);
    const result = await conn.get(trx.key);

    if (!result) throw new HttpException(404, `Value not found for key '${trx.key}' within namespace '${trx.namespace ? trx.namespace : this.connectionPool.defaultNamespace}'.`);

    return result;
  }

  // Whether a key exists in the given namespace
  async exists(trx: TransactionDto): Promise<boolean> {
    try {
      await this.select(trx);
      return true;
    } catch {
      return false;
    }
  }

  // Removes all key-values under a given namespace
  async empty(trx: TransactionDto): Promise<void> {
    const conn = await this.connectionPool.get(trx.namespace);
    await conn.clear();
  }
}
