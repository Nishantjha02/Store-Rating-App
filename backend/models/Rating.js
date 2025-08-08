const db = require('../config/database');

class Rating {
  static async create(userId, storeId, rating) {
    const connection = db.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
      [userId, storeId, rating]
    );
    return result;
  }

  static async getUserRating(userId, storeId) {
    const connection = db.getConnection();
    const [rows] = await connection.execute(
      'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    return rows[0]?.rating || 0;
  }

  static async getStoreRatings(storeId) {
    const connection = db.getConnection();
    const [rows] = await connection.execute(
      `SELECT r.rating, r.created_at, u.name as user_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  }

  static async getCount() {
    const connection = db.getConnection();
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM ratings');
    return rows[0].count;
  }

  static async getStoresWithUserRatings(userId, filters = {}) {
    const connection = db.getConnection();
    let query = `
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as overall_rating,
             COALESCE(ur.rating, 0) as user_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
    `;
    
    const conditions = [];
    const params = [userId];

    if (filters.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    
    if (filters.address) {
      conditions.push('s.address LIKE ?');
      params.push(`%${filters.address}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id, s.name, s.address, ur.rating';

    if (filters.sortBy) {
      const sortDirection = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY s.${filters.sortBy} ${sortDirection}`;
    }

    const [rows] = await connection.execute(query, params);
    return rows;
  }
}

module.exports = Rating;