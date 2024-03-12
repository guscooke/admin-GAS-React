import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function ReturnServicesCard({ returnAlerts }) {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="body1" gutterBottom>
            Alertas retorno:
        </Typography>
        {returnAlerts.map((alert, index) => (
          <Typography key={index} variant="body2" gutterBottom>
            Nome: {alert.name} - Serviço Tipo: {alert.serviceType} - Data Retorno: {alert.returnDate}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}


