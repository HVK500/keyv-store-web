import Keyv from 'keyv';
import LRUCache from 'lru-cache';
import { envValue } from '../utils/validate-env';

export default class ConnectionPoolService {
  readonly defaultNamespace = 'root';
  private readonly connectionString = envValue<string>('CONN_STRING');
  private readonly storeOptions = envValue<object>('STORE_OPTS');
  private readonly maxConnectionAge = (envValue<number>('MAX_CONN_AGE') * 1000);
  private readonly maxConnections = envValue<number>('MAX_CONN');
  private pool: LRUCache<string, Keyv>;

  constructor() {
    this.pool = new LRUCache({
      maxAge: this.maxConnectionAge,
      max: this.maxConnections
    });
  }

  async get(namespace = this.defaultNamespace): Promise<Keyv> {
    if (!this.pool.has(namespace)) {
      console.log('New connection', namespace);
      return this.connect(namespace);
    }

    console.log('Found connection', namespace);
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
    // });

    this.pool.set(namespace, conn);

    return conn;
  }
}
