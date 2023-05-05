import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Grid, Paper, Popover } from '@mui/material';
import { fetchPostApprovalUsers, fetchUsersToApprove } from '../api/userApi';
import LinearProgress from '@mui/material/LinearProgress';

export default function UserApprovalePage() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'surname', headerName: 'Surname', width: 150 },
        {
          field: 'other_info',
          headerName: 'Other Info',
          width: 250,
          renderCell: (params) => (
            <div>
              {params.value.length > 20 ? (
                <>
                    <Button variant="text" onClick={handleOtherInfoClick}>
                        {`${params.value.substring(0, 20)}...`}
                    </Button>
                    <Popover
                        open={Boolean(otherInfoAnchorEl)}
                        anchorEl={otherInfoAnchorEl}
                        onClose={handleOtherInfoClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                    >
                        <div style={{ padding: 8 }}>{params.value}</div>
                    </Popover>
                </>
              ) : (
                <div>{params.value}</div>
              )}
            </div>
          ),
        },
    ];
  const [selectionModel, setSelectionModel] = useState([]);
  const [users, setUsers] = useState([]);
  const [otherInfoAnchorEl, setOtherInfoAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    
  }, [selectionModel])

  const getUsers = async () => {
    try {
        setIsLoading(true);
        const response = await fetchUsersToApprove();
        setUsers([...response.data]);
    } catch(e) {

    } finally {
        setIsLoading(false);
    }
  }

  const handleSelectionModelChange = (newSelection) => {
    
    setSelectionModel(newSelection);
  };

  const handleOtherInfoClick = (event) => {
    setOtherInfoAnchorEl(event.currentTarget);
  };

  const handleOtherInfoClose = () => {
    setOtherInfoAnchorEl(null);
  };

  const handleApproveUsers = async () => {
    try {
        
        await fetchPostApprovalUsers(selectionModel);
        await getUsers();
        setSelectionModel([]);
    } catch(e) {
        
    }
  }

  return (
    <Grid container display="flex" justifyContent="center">
        <Grid item xs={12}>
            <Button  
                color="primary" 
                variant="contained" 
                style={{ float: "right" }}
                disabled={selectionModel && selectionModel.length === 0}
                onClick={handleApproveUsers} >
                Approve Users
            </Button>
        </Grid>
        <Grid item xs={12}>
            <Paper style={{ width: '100%', margin: '16px', height: 350 }}>
                <DataGrid
                    loading={isLoading}
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                    onSelectionModelChange={handleSelectionModelChange}
                    selectionModel={selectionModel}
                    components={{
                        LoadingOverlay: LinearProgress,
                    }}
                />
            </Paper>
        </Grid>
    </Grid>
  );
}