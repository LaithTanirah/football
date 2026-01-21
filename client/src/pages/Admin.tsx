import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui2/components/ui/Card';
import { Button } from '@/ui2/components/ui/Button';

export function Admin() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 page-section">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/admin/pitches">
          <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Manage Pitches</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-300">Create, edit, and manage football pitches</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foregroundshadow-[0_0_15px_rgba(6,182,212,0.5)]">Go to Pitches Management</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/bookings">
          <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">View Bookings</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-300">View and manage all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foregroundshadow-[0_0_15px_rgba(6,182,212,0.5)]">Go to Bookings</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

