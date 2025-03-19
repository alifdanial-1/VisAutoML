import { Box, Tooltip } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#5C5C5C',
    color: '#ffffff',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    borderRadius: '6px',
    padding: '8px',
    '& ul': {
      margin: '4px 0',
      paddingLeft: '20px',
    },
  },
}));

const ListItem = ({ item, index, alerts = [] }) => {
  // Get the most severe alert (if any)
  const mostSevereAlert = alerts.reduce((prev, curr) => {
    if (!prev) return curr;
    if (curr.severity === 'error') return curr;
    if (curr.severity === 'warning' && prev.severity !== 'error') return curr;
    return prev;
  }, null);

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon sx={{ fontSize: 16, color: '#d32f2f', ml: 1 }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 16, color: '#ed6c02', ml: 1 }} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 16, color: '#2e7d32', ml: 1 }} />;
      default:
        return null;
    }
  };

  const getTooltipContent = () => {
    if (!alerts.length) return null;

    return (
      <div>
        <strong>Data Quality Alerts:</strong>
        <ul>
          {alerts.map((alert, idx) => (
            <li key={idx} style={{ marginBottom: '4px' }}>
              {alert.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Check if all alerts are success
  const allSuccess = alerts.length > 0 && alerts.every(alert => alert.severity === 'success');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.content}
      </Box>
      {(mostSevereAlert || allSuccess) && (
        <HtmlTooltip
          title={getTooltipContent()}
          placement="right"
          arrow
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {allSuccess ? getAlertIcon('success') : getAlertIcon(mostSevereAlert.severity)}
          </Box>
        </HtmlTooltip>
      )}
    </Box>
  );
};

export default ListItem;
