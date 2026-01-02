import { Link } from 'react-router-dom';

const TeamList = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Teams</h1>
      <Link to="/teams/new" className="btn btn-primary">+ Create Team</Link>
    </div>
    <div className="card">
      <p className="text-gray-600">Team list with members will be implemented here.</p>
    </div>
  </div>
);

export default TeamList;
