# 🚀 AffilBot - Affiliate Marketing Automation Dashboard

AffilBot is a powerful affiliate marketing automation platform that helps you discover, manage, and track affiliate offers with automated Instagram posting capabilities.

## ✨ Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Track total earnings, active offers, posts this week, and total views
- **Modern UI**: Clean, responsive interface with dark mode support
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### 🔍 Offer Discovery
- **Automated Scraping**: Automatically finds offers from multiple affiliate networks
- **Network Support**: ShareASale, CJ Affiliate, Impact, Rakuten, and more
- **Smart Filtering**: Only shows offers above your minimum commission threshold (default €3.50)
- **Quick Actions**: Approve or reject offers with one click
- **Status Tracking**: Pending, Approved, Posted, Rejected status management

### 📱 Instagram Integration
- **Post Tracking**: Monitor Instagram posts with views, likes, and comments
- **Performance Metrics**: Real-time engagement analytics
- **Posting History**: Complete timeline of all posted content
- **API Ready**: Ready for Instagram Graph API integration

### ⚙️ Automation Features
- **Toggle Control**: Enable/disable automation from the header
- **Manual Discovery**: "Find New Offers" button to trigger offer discovery on demand
- **Configurable Thresholds**: Set minimum commission requirements
- **Auto-posting**: (Ready for implementation) Automatically create Instagram posts from approved offers

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- **RESTful API** architecture
- **Axios** for HTTP requests

### Frontend
- **React 18** for UI components
- **Modern CSS** with dark mode
- **Responsive Design** with CSS Grid and Flexbox
- **Axios** for API communication

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd affilibot
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Start the development server**
   ```bash
   # Terminal 1 - Start backend
   npm start

   # Terminal 2 - Start frontend
   cd client && npm start
   ```

4. **Access the application**
   - Backend API: http://localhost:3001
   - Frontend: http://localhost:3000

## 🚀 Production Deployment

### Build for Production
```bash
# Build React frontend
cd client && npm run build

# Start production server
cd .. && npm start
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

## 📡 API Endpoints

### Statistics
- `GET /api/stats` - Get dashboard statistics

### Offers
- `GET /api/offers` - Get all offers
- `GET /api/offers?status=pending` - Filter offers by status
- `POST /api/offers` - Create new offer
- `PATCH /api/offers/:id` - Update offer status
- `DELETE /api/offers/:id` - Delete offer

### Posts
- `GET /api/posts` - Get all Instagram posts
- `POST /api/posts` - Create new post

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings/:key` - Update setting value

### Automation
- `POST /api/automation/scrape-offers` - Trigger offer discovery

## 🗄️ Database Schema

### Offers Table
```sql
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- network (TEXT)
- commission (REAL)
- category (TEXT)
- status (TEXT: pending, approved, posted, rejected)
- created_at (DATETIME)
```

### Posts Table
```sql
- id (INTEGER PRIMARY KEY)
- offer_id (INTEGER)
- content (TEXT)
- views (INTEGER)
- likes (INTEGER)
- comments (INTEGER)
- posted_at (DATETIME)
```

### Settings Table
```sql
- id (INTEGER PRIMARY KEY)
- key (TEXT UNIQUE)
- value (TEXT)
```

## 🔮 Future Enhancements

- [ ] Real Instagram Graph API integration
- [ ] Actual affiliate network API connections (ShareASale, CJ, Impact)
- [ ] Advanced analytics and reporting
- [ ] Email notifications for high-value offers
- [ ] Multi-user support with authentication
- [ ] Scheduled auto-posting
- [ ] Custom posting templates
- [ ] Performance tracking and ROI calculations
- [ ] Export data to CSV/Excel
- [ ] Webhook support for real-time updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

Built with ❤️ for affiliate marketers who want to automate their workflow and maximize earnings.

---

**Happy Affiliate Marketing! 🎯💰**
