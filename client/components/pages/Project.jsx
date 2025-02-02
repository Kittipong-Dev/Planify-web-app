import React, { useState, useEffect } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import Interface from '../Interface.jsx';
import Calendar from '../Misc/Calendar.jsx';
import Task from '../../../Task.jsx';
import SettingsPopup from '../Settings.jsx';
import ConfirmationPopup from '../ConfirmationPopup.jsx';
import TaskLabel from '../TaskLabel.jsx';
import BoardProject from '../Boards/BoardProject.jsx';
import List from '../Working Area/List.jsx';
import Member from '../Member.jsx';
import ErrorBoundary from '/ErrorBoundary.jsx';
import '/styles/sidebar.css';


const Project = () => {
  const [discordSdk, setDiscordSdk] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const setupDiscordSdk = async () => {
      try {
        const discordClientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

        if (!discordClientId) {
          throw new Error('Discord Client ID is missing');
        }

        console.log('Setting up Discord SDK...');

        // Initialize Discord SDK
        const sdk = new DiscordSDK(discordClientId);
        await sdk.ready();

        console.log('Discord SDK Ready...');

        // Authorize with Discord OAuth
        const { code } = await sdk.commands.authorize({
          client_id: discordClientId,
          response_type: 'code',
          state: '',
          prompt: 'none',
          scope: ['identify', 'guilds', 'applications.commands'],
        });

        console.log('Authorization code received...');

        // Exchange authorization code for access token
        const response = await fetch('/.proxy/api/api/v1/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }

        const { access_token } = await response.json();
        console.log('Access Token received...');

        // Authenticate with Discord SDK using the access token
        await sdk.commands.authenticate({ access_token });

        console.log('Authentication successful...');

        // Fetch the user profile
        const userProfile = await fetchUserProfile(access_token);
        console.log('User Profile:', userProfile);

        setUser({
          username: userProfile.username,
          avatarUrl: `https://cdn.discordapp.com/avatars/${userProfile.id}/${userProfile.avatar}.png`,
        });

        setDiscordSdk(sdk);
      } catch (error) {
        console.error('Error setting up Discord SDK:', error);
        setUser({
          username: "placeholder",
          avatarUrl: ""})
      }
    };

    const fetchUserProfile = async (token) => {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return await response.json();
    };

    setupDiscordSdk();
  }, []);

  const handleConfirmation = () => {
    setIsConfirmationVisible(false);
  };

  const handleSettings = () => {
    console.log("hi")
  };

  if (!user) {
    console.log('User data is still loading...');
    return <div>Loading...</div>;
  }

  return (
    <div id="app">
      <ErrorBoundary>
        <Interface user={user}/>
        <Task />

        <BoardProject />
        {/* Task List and Member Components */}
        <Member members={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]} />
      </ErrorBoundary>
    </div>
  );
};

export default Project;
