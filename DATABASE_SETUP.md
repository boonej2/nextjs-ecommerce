# Database Setup Guide

## Option 1: Install PostgreSQL Locally (Recommended for Development)

### Windows Installation

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use the installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Download the latest version (15.x or 16.x)

2. **Install PostgreSQL:**
   - Run the installer
   - Remember the password you set for the `postgres` user
   - Default port is 5432 (keep this)
   - Complete the installation

3. **Verify Installation:**
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service -Name "*postgres*"
   
   # Start PostgreSQL service if not running
   Start-Service postgresql-x64-15  # Adjust version number as needed
   ```

4. **Create the Database:**
   ```powershell
   # Connect to PostgreSQL (use the password you set during installation)
   psql -U postgres
   
   # In psql, create the database:
   CREATE DATABASE frostburg_clothing;
   \q
   ```

5. **Update .env file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/frostburg_clothing?schema=public"
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

## Option 2: Use Docker (Quick Setup)

1. **Install Docker Desktop:**
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run PostgreSQL in Docker:**
   ```powershell
   docker run --name frostburg-postgres `
     -e POSTGRES_PASSWORD=postgres `
     -e POSTGRES_DB=frostburg_clothing `
     -p 5432:5432 `
     -d postgres:15
   ```

3. **Your .env file should be:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/frostburg_clothing?schema=public"
   ```

## Option 3: Use a Cloud Database (Production)

### Free Options:
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app (Free tier available)

1. Sign up for an account
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update your `.env` file with the connection string

## Troubleshooting

### Port 5432 Already in Use
If port 5432 is already in use:
```powershell
# Find what's using the port
netstat -ano | Select-String ":5432"

# Stop the conflicting service or use a different port
```

### Can't Connect to Database
1. Check if PostgreSQL is running:
   ```powershell
   Get-Service -Name "*postgres*"
   ```

2. Start PostgreSQL service:
   ```powershell
   Start-Service postgresql-x64-15  # Adjust version as needed
   ```

3. Verify connection:
   ```powershell
   psql -U postgres -h localhost -p 5432
   ```

### Database Doesn't Exist
Create it manually:
```sql
CREATE DATABASE frostburg_clothing;
```

## After Setup

Once PostgreSQL is running:

1. **Run migrations:**
   ```powershell
   npx prisma migrate dev
   ```

2. **Seed the database:**
   ```powershell
   npm run db:seed
   ```

