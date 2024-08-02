import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContextType';
import api from '../services/api';
import { Links } from '../../../shared/types/Links';
import LoadingWheel from '../components/LoadingWheel';

const LinksForm: React.FC = () => {
    const [links, setLinks] = useState<Links>({});
    const [changedLinks, setChangedLinks] = useState<Partial<Links>>({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await api.get('/api/details/links');
                setLinks(response.data);
            } catch (error) {
                console.error('Failed to fetch links:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    const handleChange = (field: keyof Links, value: string) => {
        setLinks((prevLinks) => ({
            ...prevLinks,
            [field]: value,
        }));

        setChangedLinks((prevChangedLinks) => ({
            ...prevChangedLinks,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put('/api/admin/links/put', changedLinks, { withCredentials: true });
            alert('Links updated successfully!');
            setChangedLinks({});
        } catch (error) {
            console.error('Failed to update links:', error);
            alert('Failed to update links');
        }
    };

    if (loading) {
        return <LoadingWheel/>;
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white rounded shadow">
          {Object.keys(links).map((key) => (
              <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-bold mb-2">
                      {key.replace('Link', ' Link')}
                  </label>
                  <input
                      type="text"
                      id={key}
                      value={(links as any)[key]}
                      onChange={(e) => handleChange(key as keyof Links, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
                  />
              </div>
          ))}
          <button 
              type="submit" 
              disabled={!user}
              className={`w-full py-2 px-4 font-bold text-white rounded ${user ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
          >
              Update Links
          </button>
      </form>
  );
};

export default LinksForm;
