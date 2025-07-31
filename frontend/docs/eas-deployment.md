# EAS Build and Deployment Guide for Idioms App

## Overview

This guide documents the process of building and deploying the Idioms app using EAS (Expo Application Services). The app is currently deployed to both internal testing and production.

## Prerequisites

- Node.js installed
- Expo CLI installed (`npm install -g expo-cli`)
- EAS CLI installed (`npm install -g eas-cli`)
- An Expo account
- Android Studio (for Android development)
- A valid Google Play Developer account
- A keystore file (`my-release-key.jks`) for Android signing

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the frontend directory with:

```env
API_URL=your_backend_url
```

### 2. Configuration Files

The app uses the following configuration files:

- `app.config.js`: Main Expo configuration
- `eas.json`: EAS Build configuration

## Build Process

### Development Builds

For testing locally with development features:

```bash
eas build --profile development --platform android
```

### Preview Builds

For internal testing:

```bash
eas build --profile preview --platform android
```

### Production Builds

For Play Store releases:

```bash
eas build --profile production --platform android
```

## Android Specific Configuration

### Keystore

The app uses a keystore file (`my-release-key.jks`) for signing Android builds. This file is essential for app updates and should be kept secure.

### Build Configuration

The production build is configured in `eas.json` with:

- Android App Bundle format
- Production keystore signing
- Proguard enabled for optimization

## Deployment Process

### 1. Internal Testing

1. Create a preview build
2. Upload to internal testing track
3. Share with testers via email invites

### 2. Production Release

1. Create a production build
2. Upload to Google Play Console
3. Fill out store listing information
4. Submit for review

## Current App Details

- Package Name: `com.davidserrano.idioms`
- Version: 1.0.0
- Build Number: Incremented with each release
- Minimum SDK: Android 21+

## Troubleshooting

### Common Issues

1. Build failures:
   - Check environment variables
   - Verify keystore configuration
   - Ensure all dependencies are installed

2. Upload issues:
   - Verify version codes are incremented
   - Check bundle size limits
   - Ensure all store listing requirements are met

### Important Notes

- Always test builds internally before production release
- Keep the keystore file secure and backed up
- Update version numbers appropriately for each release
- Monitor the API endpoint configuration for each environment

## Useful Commands

```bash
# View build status
eas build:list

# View build logs
eas build:logs

# Submit to store
eas submit -p android

# Update app config
eas update
```

## Resources

- [EAS Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/)
