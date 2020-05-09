import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Link,
  Grid,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  severityLow: {
    backgroundColor: 'yellow',
  },
  severityMedium: {
    backgroundColor: 'orange',
  },
  severityHigh: {
    backgroundColor: 'red',
  },
  severityCritical: {
    backgroundColor: 'purple',
  },
  cvssContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function Cve(props) {
  const classes = useStyles();

  const handleCveClick = (id) => {
    props.setIsOpen({
      ...props.isOpen,
      [id]: !props.isOpen[id],
    });
  };

  return (
    <div>
      <ListItem
        key={props.cve.id}
        button
        onClick={() => {
          handleCveClick(props.cve.id);
        }}
      >
        <ListItemText
          primary={props.cve.id}
          style={{ display: 'flex', justifyContent: 'center' }}
        ></ListItemText>
        {props.isOpen[props.cve.id] ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={props.isOpen[props.cve.id]} timeout="auto" unmountOnExit>
        <ListItem>
          <ListItemText>
            <Typography variant="body1" color="textSecondary">
              {'Published: ' +
                new Date(props.cve.publishedDate).toLocaleString('ro-RO')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {'Last modified: ' +
                new Date(props.cve.lastModifiedDate).toLocaleString('ro-RO')}
            </Typography>
            <Typography variant="h5">Description</Typography>
            <Typography variant="body1">
              {props.cve.description.description_data[0].value}
            </Typography>
            <Divider />

            <Typography variant="h5">References</Typography>
            {props.cve.references.reference_data.map((reference) => (
              <div>
                <Link href={reference.url} target="_blank">
                  {reference.url}
                </Link>
                <br></br>
              </div>
            ))}
            <Divider />

            <Typography variant="h5">Impact</Typography>
            <Grid
              container
              className={classes.cvssContainer}
              alignContent="center"
              alignItems="center"
            >
              <Grid item xs={6} align="center">
                <Typography variant="h6" align="center">
                  CVSS Version 3.x
                </Typography>
                <div>
                  {props.cve.impact && props.cve.impact.baseMetricV3 ? (
                    <>
                      <Typography
                        display="inline"
                        variant="body1"
                        align="center"
                        className={
                          (props.cve.impact.baseMetricV3.cvssV3.baseSeverity ==
                            'LOW' &&
                            classes.severityLow) ||
                          (props.cve.impact.baseMetricV3.cvssV3.baseSeverity ==
                            'MEDIUM' &&
                            classes.severityMedium) ||
                          (props.cve.impact.baseMetricV3.cvssV3.baseSeverity ==
                            'HIGH' &&
                            classes.severityHigh) ||
                          (props.cve.impact.baseMetricV3.cvssV3.baseSeverity ==
                            'CRITICAL' &&
                            classes.severityCritical)
                        }
                      >
                        {`Base score: 
                              ${props.cve.impact.baseMetricV3.cvssV3.baseScore} ${props.cve.impact.baseMetricV3.cvssV3.baseSeverity}`}
                      </Typography>
                      <br />
                      <Typography
                        display="inline"
                        variant="body1"
                        align="center"
                      >
                        {'Vector: ' +
                          props.cve.impact.baseMetricV2.cvssV2.vectorString}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" align="center">
                      N/A
                    </Typography>
                  )}
                </div>
              </Grid>
              <Grid item xs={6} align="center">
                <Typography variant="h6" align="center">
                  CVSS Version 2.0
                </Typography>
                <div>
                  {props.cve.impact && props.cve.impact.baseMetricV2 ? (
                    <>
                      <Typography
                        display="inline"
                        variant="body1"
                        align="center"
                        className={
                          (props.cve.impact.baseMetricV2.severity == 'LOW' &&
                            classes.severityLow) ||
                          (props.cve.impact.baseMetricV2.severity == 'MEDIUM' &&
                            classes.severityMedium) ||
                          (props.cve.impact.baseMetricV2.severity == 'HIGH' &&
                            classes.severityHigh)
                        }
                      >
                        {`Base score: 
                              ${props.cve.impact.baseMetricV2.cvssV2.baseScore} ${props.cve.impact.baseMetricV2.severity}`}
                      </Typography>
                      <br />
                      <Typography
                        display="inline"
                        variant="body1"
                        align="center"
                      >
                        {'Vector: ' +
                          props.cve.impact.baseMetricV2.cvssV2.vectorString}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" align="center">
                      N/A
                    </Typography>
                  )}
                </div>
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      </Collapse>
      <Divider />
    </div>
  );
}

export default Cve;
