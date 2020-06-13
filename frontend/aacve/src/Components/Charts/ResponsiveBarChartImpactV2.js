import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chart: {
    height: '50vh',
    width: '100vw',
  },
}));

function ResponsiveBarChartImpactV2(props) {
  const classes = useStyles();

  return (
    <div className={classes.chart}>
      <ResponsiveBar
        data={props.data}
        indexBy="filter"
        colorBy={'index'}
        keys={['avgImpactScoreV2']}
        margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'purpleRed_green' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Filter',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Average V2 Impact Score',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
}

export default ResponsiveBarChartImpactV2;
