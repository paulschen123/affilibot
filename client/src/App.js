import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [stats, setStats] = useState({ totalEarnings: 0, activeOffers: 0, postsThisWeek: 0, totalViews: 0 });
  const [offers, setOffers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('offers');
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchStats();
    fetchOffers();
    fetchPosts();
    fetchSettings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/offers`);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings`);
      setAutomationEnabled(response.data.automation_enabled === 'true');
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleOfferAction = async (id, action) => {
    try {
      await axios.patch(`${API_URL}/api/offers/${id}`, { status: action });
      fetchOffers();
      fetchStats();
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  const handleFindOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/automation/scrape-offers`);
      alert(response.data.message);
      fetchOffers();
      fetchStats();
    } catch (error) {
      console.error('Error scraping offers:', error);
      alert('Error finding new offers');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async () => {
    const newValue = !automationEnabled;
    try {
      await axios.put(`${API_URL}/api/settings/automation_enabled`, { 
        value: newValue.toString() 
      });
      setAutomationEnabled(newValue);
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'posted': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 AffilBot</h1>
          <div className="header-actions">
            <button 
              className={`automation-toggle ${automationEnabled ? 'active' : ''}`}
              onClick={toggleAutomation}
            >
              {automationEnabled ? '✅ Automation ON' : '❌ Automation OFF'}
            </button>
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Earnings</h3>
              <p className="stat-value">€{stats.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>Active Offers</h3>
              <p className="stat-value">{stats.activeOffers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📱</div>
            <div className="stat-info">
              <h3>Posts This Week</h3>
              <p className="stat-value">{stats.postsThisWeek}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <h3>Total Views</h3>
              <p className="stat-value">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="tabs-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              📋 Offers
            </button>
            <button 
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              📸 Instagram Posts
            </button>
          </div>

          {activeTab === 'offers' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Affiliate Offers</h2>
                <button 
                  className="primary-button"
                  onClick={handleFindOffers}
                  disabled={loading}
                >
                  {loading ? '🔍 Searching...' : '🔍 Find New Offers'}
                </button>
              </div>

              <div className="offers-grid">
                {offers.length === 0 ? (
                  <div className="empty-state">
                    <p>No offers yet. Click "Find New Offers" to discover opportunities!</p>
                  </div>
                ) : (
                  offers.map(offer => (
                    <div key={offer.id} className="offer-card">
                      <div className="offer-header">
                        <span 
                          className="offer-status"
                          style={{ backgroundColor: getStatusColor(offer.status) }}
                        >
                          {offer.status}
                        </span>
                        <span className="offer-network">{offer.network}</span>
                      </div>
                      <h3 className="offer-title">{offer.title}</h3>
                      <p className="offer-category">{offer.category}</p>
                      <div className="offer-commission">
                        <span className="commission-label">Commission:</span>
                        <span className="commission-value">€{offer.commission.toFixed(2)}</span>
                      </div>

                      {offer.status === 'pending' && (
                        <div className="offer-actions">
                          <button 
                            className="approve-button"
                            onClick={() => handleOfferAction(offer.id, 'approved')}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            className="reject-button"
                            onClick={() => handleOfferAction(offer.id, 'rejected')}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Instagram Posts</h2>
              </div>

              <div className="posts-grid">
                {posts.length === 0 ? (
                  <div className="empty-state">
                    <p>No posts yet. Approve offers to start posting!</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <div key={post.id} className="post-card">
                      <h3 className="post-title">{post.offer_title || 'Instagram Post'}</h3>
                      <p className="post-content">{post.content}</p>
                      <div className="post-stats">
                        <div className="post-stat">
                          <span>👁️ {post.views.toLocaleString()}</span>
                        </div>
                        <div className="post-stat">
                          <span>❤️ {post.likes.toLocaleString()}</span>
                        </div>
                        <div className="post-stat">
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                      <div className="post-date">
                        {new Date(post.posted_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>AffilBot - Affiliate Marketing Automation Dashboard</p>
      </footer>
    </div>
  );
}

export default App;
