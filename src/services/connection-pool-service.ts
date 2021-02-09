import Keyv from 'keyv';
import LRUCache from 'lru-cache';
import { envValue } from '../utils/validate-env';

export default class ConnectionPoolService {
  readonly defaultNamespace = 'root';
  private connectionString: string;
  private storeOptions: object;
  private pool: LRUCache<string, Keyv>;

  constructor() {
    this.connectionString = envValue<string>('CONN_STRING');
    this.storeOptions = envValue<object>('STORE_OPTS');

    this.pool = new LRUCache({
      maxAge: (envValue<number>('MAX_CONN_AGE') * 1000),
      max: envValue<number>('MAX_CONN')
    });
  }

  async get(namespace = this.defaultNamespace): Promise<Keyv> {
    if (!this.pool.has(namespace)) {
      return this.connect(namespace);
    }

    return this.pool.get(namespace);
  }

  private connect(namespace: string): Keyv {
    const conn = new Keyv(
      this.connectionString,
      Object.assign(
        { namespace: namespace },
        this.storeOptions
      )
    );

    // conn.on('error', (err) => {
    //   console.log(err);
    // });

    this.pool.set(namespace, conn);

    return conn;
  }
}
