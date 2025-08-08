const db = require('../config/database');

class User {
  static async findByEmail(email) {
    const connection = db.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const connection = db.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(userData) {
    const connection = db.getConnection();
    const { name, email, password, address, role = 'user' } = userData;
    
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, address, role]
    );
    
    return result.insertId;
  }

  static async getAll(filters = {}) {
    const connection = db.getConnection();
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             COALESCE(AVG(r.rating), 0) as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    const conditions = [];
    const params = [];

    if (filters.name) {
      conditions.push('u.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    
    if (filters.email) {
      conditions.push('u.email LIKE ?');
      params.push(`%${filters.email}%`);
    }
    
    if (filters.address) {
      conditions.push('u.address LIKE ?');
      params.push(`%${filters.address}%`);
    }
    
    if (filters.role) {
      conditions.push('u.role = ?');
      params.push(filters.role);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at';

    if (filters.sortBy) {
      const sortDirection = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY u.${filters.sortBy} ${sortDirection}`;
    }

    const [rows] = await connection.execute(query, params);
    return rows;
  }

  static async updatePassword(userId, newPassword) {
    const connection = db.getConnection();
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, userId]
    );
  }

  static async getCount() {
    const connection = db.getConnection();
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    return rows[0].count;
  }
}

module.exports = User;