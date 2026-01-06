import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Admin() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 page-section">
      <h1 className="text-page-title mb-8 text-text-primary">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/admin/pitches">
          <Card>
            <CardHeader>
              <CardTitle className="text-section-title">Manage Pitches</CardTitle>
              <CardDescription className="text-caption">Create, edit, and manage football pitches</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="font-semibold">Go to Pitches Management</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/bookings">
          <Card>
            <CardHeader>
              <CardTitle className="text-section-title">View Bookings</CardTitle>
              <CardDescription className="text-caption">View and manage all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="font-semibold">Go to Bookings</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

