'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

type Resource = {
  id: string;
  title: string;
  category: string;
  type: string;
  content_url: string;
  is_free: boolean;
  tags: string[];
  language: string;
};

export default function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploading, setUploading] = useState(false);

  const categories = ['All', 'Anxiety', 'Depression', 'CBT', 'Trauma', 'Relaxation', 'Mood', 'Stress'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('title');
    setResources(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileName = `resources/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('public-resources')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('public-resources')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('resources').insert({
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: 'General',
        type: file.name.toLowerCase().endsWith('.pdf') ? 'worksheet' : 'guide',
        content_url: urlData.publicUrl,
        is_free: true,
        tags: ['new'],
        language: 'English'
      });

      if (dbError) throw dbError;

      alert('✅ Resource uploaded successfully!');
      fetchResources();
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Resource Library</h1>
            <p className="text-gray-600 mt-3 text-lg">Free worksheets, guides & tools for mental health support</p>
          </div>

          {/* Upload Section */}
          <div className="mb-10 bg-white p-8 rounded-3xl border border-dashed border-gray-300 text-center">
            <p className="font-medium text-gray-700 mb-2">Upload New Resource</p>
            <p className="text-sm text-gray-500 mb-4">PDF, images, or other files</p>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block mx-auto text-sm file:mr-4 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {uploading && <p className="mt-3 text-blue-600">Uploading...</p>}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl text-gray-900"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-2xl bg-white text-gray-900"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {loading ? (
            <p className="text-center py-12 text-gray-500">Loading resources...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {resource.category}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                  </div>

                  <h3 className="font-semibold text-xl text-gray-900 mb-3 leading-tight">
                    {resource.title}
                  </h3>

                  <a
                    href={resource.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-2xl transition mt-6"
                  >
                    Download Free
                  </a>
                </div>
              ))}
            </div>
          )}

          {filteredResources.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-12">No resources found. Try a different search or upload one above.</p>
          )}
        </div>
      </div>
    </>
  );
}