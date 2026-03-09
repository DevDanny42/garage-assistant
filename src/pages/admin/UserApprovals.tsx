import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type PendingUser } from '@/api/users';
import { Check, X, FileText, ExternalLink, Clock, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: UserCheck },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: UserX },
};

export const UserApprovals: React.FC = () => {
  const queryClient = useQueryClient();
  const [confirmAction, setConfirmAction] = React.useState<{ id: string; action: 'approve' | 'reject' } | null>(null);

  const { data: usersRaw = [], isLoading, isError } = useQuery({
    queryKey: ['pending-users'],
    queryFn: usersApi.getPending,
    retry: 1,
  });

  const users = Array.isArray(usersRaw) ? usersRaw : [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => usersApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      toast.success('User approved successfully');
    },
    onError: () => toast.error('Failed to approve user'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => usersApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      toast.success('User rejected');
    },
    onError: () => toast.error('Failed to reject user'),
  });

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.action === 'approve') {
      approveMutation.mutate(confirmAction.id);
    } else {
      rejectMutation.mutate(confirmAction.id);
    }
    setConfirmAction(null);
  };

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and verify new user registrations</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
              <div className="h-5 bg-muted rounded w-2/3 mb-3" />
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-3/4 mb-4" />
              <div className="h-8 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : isError || users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <UserCheck className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">{isError ? 'Unable to load approvals' : 'No pending approvals'}</p>
          <p className="text-sm">{isError ? 'Please ensure the backend API is running and configured' : 'All user registrations have been reviewed'}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const status = statusConfig[user.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={user.id}
                className="rounded-xl border border-border bg-card p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline" className={`${status.color} text-xs`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="text-foreground">{user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registered</span>
                    <span className="text-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Document */}
                {user.documentUrl && (
                  <a
                    href={`${apiBaseUrl}${user.documentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors text-sm"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="truncate flex-1 text-foreground">
                      {user.documentName || 'ID Document'}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                )}

                {/* Actions */}
                {user.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setConfirmAction({ id: user.id, action: 'approve' })}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setConfirmAction({ id: user.id, action: 'reject' })}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.action === 'approve' ? 'Approve User' : 'Reject User'}
        description={
          confirmAction?.action === 'approve'
            ? 'This user will be able to log in and access the system. Are you sure?'
            : 'This user will be removed. Are you sure you want to reject?'
        }
        onConfirm={handleConfirm}
        variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'}
      />
    </div>
  );
};
