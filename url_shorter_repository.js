class ProjectRepository {  
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash VARCHAR(40) NOT NULL,
        to_url VARCHAR(512) NOT NULL
        )`
      return this.dao.run(sql)
    }
    create(hash, to_url) {
        return this.dao.run(
          'INSERT INTO urls (hash, to_url) VALUES (?, ?)',
          [hash, to_url])
    }
    update(project) {
        const { id, name } = project
        return this.dao.run(
          `UPDATE urls SET name = ? WHERE id = ?`,
          [name, id]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM urls WHERE id = ?`,
          [id]
        )
    }
    getById(id) {
      return this.dao.get(
        `SELECT hash FROM urls WHERE id = ?`,
        [id])
  }
    getByHash(hash) {
        return this.dao.get(
          `SELECT * FROM urls WHERE hash = ?`,
          [hash])
    }
    getAll() {
        return this.dao.all(`SELECT * FROM urls`)
    }
    /*
    getTasks(projectId) {
        return this.dao.all(
          `SELECT * FROM tasks WHERE projectId = ?`,
          [projectId])
    }
    */
  }
  
  module.exports = ProjectRepository;  