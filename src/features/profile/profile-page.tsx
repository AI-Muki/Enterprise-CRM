import { useState, useEffect, type FormEvent } from 'react';
import { Mail, Phone, Calendar, Save, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Field, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/misc';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('mdy');
  const [createdAt, setCreatedAt] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, title, created_at')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFullName(data.full_name || '');
        setEmail(data.email || user.email);
        setTitle(data.title || '');
        setCreatedAt(data.created_at || '');
      } else {
        setFullName(user.name);
        setEmail(user.email);
      }

      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        title,
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal information and preferences"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Profile card */}
        <Card className="animate-fade-in-up">
          <CardContent className="flex flex-col items-center p-6">
            <div className="relative">
              <Avatar name={fullName || user?.name || 'User'} size="xl" />
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-700 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-3 text-lg font-semibold">{fullName || user?.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{user?.role?.replace('_', ' ')} · {user?.organizationName ?? 'No organization'}</p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{email}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{joinDate ? `Joined ${joinDate}` : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <div className="space-y-6">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Profile updated successfully</span>
                  </div>
                )}
                <Field label="Full name" required>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                </Field>
                <Field label="Email" required>
                  <Input value={email} type="email" disabled />
                </Field>
                <Field label="Phone">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0000" />
                </Field>
                <Field label="Title">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VP of Sales" />
                </Field>
                <Field label="Bio">
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
                </Field>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit" loading={saving}>
                    {!saving && (
                      <>
                        <Save className="h-4 w-4" />
                        Save changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animate-delay-100">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Language">
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Select>
                </Field>
                <Field label="Date format">
                  <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                    <option value="mdy">MM/DD/YYYY</option>
                    <option value="dmy">DD/MM/YYYY</option>
                    <option value="ymd">YYYY-MM-DD</option>
                  </Select>
                </Field>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4" />
                  Save preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
