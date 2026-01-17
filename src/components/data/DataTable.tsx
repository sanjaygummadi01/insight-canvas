import React, { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { DataRow } from '@/types/analytics';
import { useData } from '@/context/DataContext';

interface DataTableProps {
  data: DataRow[];
  maxRows?: number;
}

export const DataTable: React.FC<DataTableProps> = ({ data, maxRows = 50 }) => {
  const { updateRow, deleteRow } = useData();
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const displayedData = data.slice(0, maxRows);
  const columns = ['date', 'sales', 'revenue', 'users', 'growth'];

  const handleEdit = (row: DataRow, field: string) => {
    setEditingCell({ id: row.id, field });
    setEditValue(String(row[field]));
  };

  const handleSave = () => {
    if (!editingCell) return;

    const numericFields = ['sales', 'revenue', 'users', 'growth'];
    const value = numericFields.includes(editingCell.field)
      ? parseFloat(editValue) || 0
      : editValue;

    updateRow(editingCell.id, editingCell.field, value);
    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No data available</p>
        <p className="text-sm mt-1">Upload a CSV file to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="capitalize">
                {col}
              </th>
            ))}
            <th className="w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col}>
                  {editingCell?.id === row.id && editingCell?.field === col ? (
                    <div className="flex items-center gap-2">
                      <input
                        type={col === 'date' ? 'text' : 'number'}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-2 py-1 bg-background border border-primary rounded text-sm focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        className="p-1 text-success hover:bg-success/10 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-muted-foreground hover:bg-muted rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onDoubleClick={() => handleEdit(row, col)}
                      className="cursor-pointer hover:bg-muted/50 px-1 -mx-1 rounded"
                    >
                      {col === 'sales' || col === 'revenue'
                        ? `$${Number(row[col]).toLocaleString()}`
                        : col === 'growth'
                        ? `${row[col]}%`
                        : row[col]}
                    </span>
                  )}
                </td>
              ))}
              <td>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(row, 'sales')}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Edit row"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRow(row.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Delete row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > maxRows && (
        <div className="text-center py-4 text-sm text-muted-foreground border-t border-border">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
};
