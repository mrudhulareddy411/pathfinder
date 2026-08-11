# Pathfinder AI - Android Studio Application

This directory contains the Android Studio compatible Android Application project configuration for Pathfinder AI.

## Project Structure & Opening in Android Studio

- **Android Studio Project Root**: `d:\pathfinder\mobile\android` (or open `d:\pathfinder\android` directly)
- **Package Name**: `com.pathfinder.app`
- **Target SDK**: Android 14 (API 34)
- **Min SDK**: Android 7.0 (API 24)

## REST API Configurations

- **Emulator API Endpoint**: `http://10.0.2.2:5000/api`
- **Network Security Config**: `app/src/main/res/xml/network_security_config.xml` (Cleartext HTTP traffic enabled for development localhost / 10.0.2.2).
- **JWT Auth**: Automatic header bearer injection via persistent token storage.

## How to Build & Run in Android Studio

1. Open **Android Studio**.
2. Select **Open an Existing Project**.
3. Choose `d:\pathfinder\mobile\android` (or `d:\pathfinder\android`).
4. Wait for Gradle Sync to complete.
5. Launch your Android Emulator or connect a physical Android device.
6. Click **Run 'app'** (Shift + F10).
