const db = require('../config/database');

class Store {
  static async create(storeData) {
    const connection = db.getConnection();
    const { name, email, address, owner_id } = storeData;
    
    const [result] = await connection.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    
    return result.insertId;
  }

  static async getAll(filters = {}) {
    const connection = db.getConnection();
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    const conditions = [];
    const params = [];

    if (filters.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    
    if (filters.email) {
      conditions.push('s.email LIKE ?');
      params.push(`%${filters.email}%`);
    }
    
    if (filters.address) {
      conditions.push('s.address LIKE ?');
      params.push(`%${filters.address}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.created_at';

    if (filters.sortBy) {
      const sortDirection = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY s.${filters.sortBy} ${sortDirection}`;
    }

    const [rows] = await connection.execute(query, params);
    return rows;
  }

  static async getByOwner(ownerId) {
    const connection = db.getConnection();
    const [rows] = await connection.execute(
      `SELECT s.*, COALESCE(AVG(r.rating), 0) as rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [ownerId]
    );
    return rows[0];
  }

  static async getCount() {
    const connection = db.getConnection();
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM stores');
    return rows[0].count;
  }

  static async findByEmail(email) {
    const connection = db.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM stores WHERE email = ?',
      [email]
    );
    return rows[0];
  }
}

module.exports = Store;