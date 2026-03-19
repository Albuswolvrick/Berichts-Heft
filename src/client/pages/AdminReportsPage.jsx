import React, { useState, useEffect } from 'react';
import { reportsApi, userApi } from '../services/api';
import { formatDate } from '../utils/dateUtils';

const AdminReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [reportsData, usersData] = await Promise.all([
                    reportsApi.getAll(),
                    userApi.getAll(),
                ]);
                setReports(reportsData);
                setUsers(usersData);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const query = { search: searchTerm, userId: selectedUserId };
            const reportsData = await reportsApi.getAll(query);
            setReports(reportsData);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Admin Reports</h1>
            <form onSubmit={handleSearch} className="mb-4">
                <div className="field is-grouped">
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="control">
                        <div className="select">
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="">All Users</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        <button type="submit" className="button is-primary">Search</button>
                    </div>
                </div>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="has-text-danger">{error}</p>}

            <div className="table-container">
                <table className="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={`${report.type}-${report.id}`}>
                                <td>{report.title || report.name}</td>
                                <td>{report.type}</td>
                                <td>{report.user.name}</td>
                                <td>{formatDate(report.createdAt)}</td>
                                <td>{report.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReportsPage;