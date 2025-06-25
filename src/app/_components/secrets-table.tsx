"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  Lock as LockIcon,
  Timer as TimerIcon,
  MoreVert as MoreVertIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { formatDistanceToNow, format } from "date-fns";
import { useSnackbar } from "notistack";
import { type Secret, type SecretStatus } from "@/stores";

interface SecretsTableProps {
  secrets: Secret[];
  loading?: boolean;
  onEdit: (secret: Secret) => void;
  onDelete: (secret: Secret) => void;
}

const getStatusColor = (status: SecretStatus) => {
  switch (status) {
    case "active":
      return "success";
    case "viewed":
      return "info";
    case "expired":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: SecretStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "viewed":
      return "Viewed";
    case "expired":
      return "Expired";
    default:
      return "Unknown";
  }
};

export function SecretsTable({
  secrets,
  loading = false,
  onEdit,
  onDelete,
}: SecretsTableProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    secret: Secret,
  ) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedSecret(secret);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedSecret(null);
  };

  const handleCopyLink = (secretId: string) => {
    const url = `${window.location.origin}/secret/${secretId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        enqueueSnackbar("Secret link copied to clipboard!", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Failed to copy link", { variant: "error" });
      });
    handleActionMenuClose();
  };

  const handleViewSecret = (secretId: string) => {
    window.open(`/secret/${secretId}`, "_blank");
    handleActionMenuClose();
  };

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  };

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (loading) {
    return (
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={80} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (secrets.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 6, textAlign: "center" }}>
        <LockIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No secrets found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first secret to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {secrets.map((secret) => (
              <TableRow
                key={secret.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {truncateContent(secret.content)}
                    </Typography>
                    {secret.hasPassword && (
                      <Tooltip title="Password protected">
                        <LockIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                      </Tooltip>
                    )}
                    {secret.oneTimeAccess && (
                      <Tooltip title="One-time access">
                        <ViewIcon
                          sx={{ fontSize: 16, color: "warning.main" }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(secret.status)}
                    color={getStatusColor(secret.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={formatDate(secret.createdAt)}>
                    <Typography variant="body2" color="text.secondary">
                      {formatRelativeTime(secret.createdAt)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {secret.expiresAt ? (
                    <Tooltip title={formatDate(secret.expiresAt)}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <TimerIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatRelativeTime(secret.expiresAt)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Never
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, secret)}
                    aria-label="more actions"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => selectedSecret && handleCopyLink(selectedSecret.id)}
        >
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => selectedSecret && handleViewSecret(selectedSecret.id)}
        >
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Secret</ListItemText>
        </MenuItem>
        {selectedSecret && !selectedSecret.isViewed && (
          <MenuItem
            onClick={() => {
              onEdit(selectedSecret);
              handleActionMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (selectedSecret) {
              onDelete(selectedSecret);
              handleActionMenuClose();
            }
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
