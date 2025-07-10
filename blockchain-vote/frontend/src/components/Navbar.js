import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#ebebeb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  color: '#1e293b',
  minHeight: '100px'
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  minHeight: '100px',
  height: '100%',
  '@media (min-width: 600px)': {
    padding: '1rem 3.5rem'
  }
});

const LogoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  height: '100%',
  position: 'relative',
  marginLeft: '25px'
});

const WalletSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  height: '100%',
  padding: '0.75rem 1.25rem',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

const TitleContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '10px'
});

const LogoImage = styled('img')({
  width: '45px',
  height: '45px',
  objectFit: 'contain',
  marginTop: '-10px'
});

const Navbar = ({ 
  account, 
  isOwner,
  onConnect, 
  onDisconnect,
  onSwitchAccount,
  isDisconnected 
}) => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <LogoSection>
          <LogoImage src="/ethlogo.png" alt="Logo" />
          <TitleContainer>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.5rem'
              }}
            >
              ETH
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1.5rem',
                marginTop: '-5px'
              }}
            >
              Voting
            </Typography>
          </TitleContainer>
        </LogoSection>

        <WalletSection>
          {account && !isDisconnected && (
            <>
              <Chip
                label={`${account.slice(0, 6)}...${account.slice(-4)}`}
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: '#cbd5e1',
                  backgroundColor: 'white',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  padding: '0.25rem'
                }}
              />
              <Button
                variant="contained"
                startIcon={<SyncAltIcon />}
                onClick={onSwitchAccount}
                sx={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#2980b9'
                  }
                }}
              >
                Hesap Değiştir
              </Button>
              {isOwner && (
                <Chip
                  icon={<span role="img" aria-label="crown">👑</span>}
                  label="Kontrat Sahibi"
                  size="small"
                  sx={{
                    backgroundColor: '#fefce8',
                    color: '#854d0e',
                    borderColor: '#fef08a',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      fontSize: '1rem'
                    }
                  }}
                />
              )}
            </>
          )}

          {(!account || isDisconnected) ? (
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={onConnect}
              sx={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1d4ed8'
                }
              }}
            >
              MetaMask'ı Bağla
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={onDisconnect}
              sx={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#b91c1c'
                }
              }}
            >
              Bağlantıyı Kes
            </Button>
          )}
        </WalletSection>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 