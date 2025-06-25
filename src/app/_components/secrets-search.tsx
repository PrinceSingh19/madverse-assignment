"use client";

import { useCallback } from "react";
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

interface SecretsSearchProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function SecretsSearch({
  onSearch,
  searchQuery,
}: SecretsSearchProps) {
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(event.target.value);
    },
    [onSearch],
  );

  const handleClearSearch = useCallback(() => {
    onSearch("");
  }, [onSearch]);

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Search secrets..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                edge="end"
                aria-label="clear search"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="medium"
      />
    </Paper>
  );
}
