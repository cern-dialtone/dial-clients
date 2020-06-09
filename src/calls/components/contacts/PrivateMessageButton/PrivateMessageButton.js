import React from 'react';
import { Button } from 'semantic-ui-react';

export default function PrivateMessageButton({ profile }) {
  return (
    <a
      href={
        'https://mattermost.web.cern.ch/_redirect/messages/@' + profile.username
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button fluid className="CalleeProfileNumber" role="button">
        <i aria-hidden="true" className="chat icon"></i>
        Send private message
      </Button>
    </a>
  );
}
