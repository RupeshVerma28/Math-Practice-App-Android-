# MathSprint — Learn Math. Calculate Faster.

**MathSprint** is an interactive Android mathematics learning and practice application designed to help students and learners strengthen their calculation skills, improve mental math speed, and build confidence through structured learning and engaging practice sessions.

With a clean, responsive dark interface, offline learning content, difficulty-based exercises, and contextual sound effects, MathSprint makes everyday mathematics practice accessible and enjoyable.

<p align="center">
  <a href="https://expo.dev/accounts/developer75/projects/mathsprint/builds/268769bf-2ebc-452b-be70-dd5c7db92a16">
    <strong>⬇ Download MathSprint APK</strong>
  </a>
  <br />
  <sub>Android installation package · Expo EAS Build</sub>
</p>

## ✨ Features

### 📚 Learn Mathematics

Explore essential mathematical concepts through structured learning modules.

- **Multiplication Tables:** Learn tables from 1 to 100.
- **Squares:** Study squares of numbers from 1 to 100.
- **Cubes:** Learn cubes of numbers from 1 to 100.
- **Mental Math:** Explore techniques for addition, subtraction, multiplication, division, and faster calculations.
- **Interactive Quizzes:** Reinforce concepts with questions and immediate feedback.

### ⚡ Practice and Improve Speed

Practice mathematical operations at your own pace or challenge yourself with timed exercises.

- **Multiple Topics:** Addition, subtraction, multiplication, division, tables, squares, cubes, and mixed calculations.
- **Three Difficulty Levels:** Easy, Medium, and Hard.
- **Dynamic Questions:** Generate practice questions based on the selected topic and difficulty.
- **Custom Numeric Keypad:** Enter answers conveniently on mobile devices.
- **Timed Practice:** Challenge yourself with an optional 60-second mode.
- **Progress Feedback:** View session scores, accuracy, streaks, and results.
- **Retry Sessions:** Repeat exercises or switch difficulty levels to continue practicing.

### 🎨 User-Friendly Interface

- Modern dark theme designed for comfortable use in low-light environments.
- Responsive layouts for different screen sizes.
- Simple navigation focused on the two primary sections: Learn and Practice.
- Clear mathematical expressions, readable text, and accessible controls.
- Smooth animations and visual feedback.
- Contextual sound effects for correct answers, incorrect answers, and completed practice sessions.
- Sound controls to disable audio when preferred.
- No vibration or haptic feedback.

### 🔒 Privacy-Focused and Offline-Friendly

MathSprint is designed to work without a user account or backend.

- No login or signup.
- No backend server or database.
- No analytics or tracking.
- No persistent storage of practice scores, answers, streaks, or personal progress.
- Learning content and question generation run locally.
- Local sound assets allow audio feedback without streaming audio.

Practice results are temporary and are not retained as a persistent user history.

## 🎯 Use Cases

MathSprint can be useful for:

- **School students:** Memorize multiplication tables and understand squares and cubes.
- **Competitive exam aspirants:** Strengthen mental arithmetic and practice calculations under time pressure.
- **College students:** Refresh fundamental mathematical skills.
- **Daily mental exercise:** Improve calculation fluency through short, repeatable sessions.
- **Self-paced learners:** Practice independently without creating an account or sharing personal information.
- **Teachers and parents:** Use structured learning topics as supplementary practice material.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI development |
| Expo | Development tooling and application infrastructure |
| JavaScript | Mathematical logic, question generation, and application behavior |
| Expo Router | Screen navigation, if configured in the project |
| Expo Audio | Local sound effects and audio playback |
| React Native Reanimated | Smooth UI animations, where used |
| Lucide React Native | Interface icons |
| EAS Build | Cloud-based Android application builds |

The application uses client-side logic and bundled learning content. A backend, cloud database, and authentication system are not required.

## 📲 Download and Install

**[Download the MathSprint APK](https://expo.dev/accounts/developer75/projects/mathsprint/builds/268769bf-2ebc-452b-be70-dd5c7db92a16)**

1. Open the download link on your Android phone.
2. Download the APK from the Expo build page.
3. Open the downloaded file.
4. If Android requests permission, allow installation from that source in your device settings.
5. Complete the installation and launch MathSprint.

Only install APK files from sources you trust. The link above points to the project's Expo EAS build page.

## 💻 Run the Project Locally

### Prerequisites

- Node.js and npm.
- Git.
- An Expo-compatible development environment.
- An Expo account if you intend to create cloud builds.

### Setup

Clone the repository:

```bash
git clone https://github.com/RupeshVerma28/Math-Practice-App-Android-.git
```

Navigate to the project directory:

```bash
cd Math-Practice-App-Android-
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Follow the terminal instructions to open the app in a compatible development environment.

### Run checks

```bash
npx expo-doctor
npm run lint
npm test
```

Run these commands according to the scripts available in the current project.

### Build a shareable Android APK

Install or invoke the EAS CLI and authenticate with Expo:

```bash
npx eas-cli@latest login
```

Build the Android preview APK:

```bash
npx eas-cli@latest build --platform android --profile preview
```

The `preview` profile must be configured to generate an APK in `eas.json`. EAS Build produces the Android artifact and provides its build details and download link when available.

## 🔐 Privacy and Data Handling

MathSprint follows a local-first design philosophy.

| Data or capability | Behavior |
|---|---|
| Personal information | Not requested |
| Account credentials | Not required |
| Practice history | Not persistently stored |
| Session scores | Temporary |
| Learning content | Available locally |
| Question generation | Performed on-device |
| Backend communication | Not required for core functionality |
| Vibration | Not used |
| Sound effects | Optional |

This describes the intended application design; it should not be interpreted as an independent security audit of every dependency or the Android operating environment.

## 🚀 Future Improvements

Potential improvements for future versions include:

- **Expanded Learning Content:** Fractions, percentages, ratios, averages, LCM, and HCF.
- **Advanced Mental Math:** More structured calculation strategies with step-by-step explanations.
- **Adaptive Difficulty:** Adjust question difficulty based on performance within the current session.
- **Custom Practice Sessions:** Configure question counts, number ranges, and operation combinations.
- **More Practice Modes:** Daily challenges, survival mode, and mixed-operation challenges.
- **Accessibility Enhancements:** Additional text-size controls and improved accessibility options.
- **Additional Languages:** Support for Hindi and other languages.
- **Optional Local Progress:** An opt-in way to retain progress on the device, with clear privacy controls.
- **Improved Learning Visualizations:** Number patterns, visual examples, and guided demonstrations.

These are proposed enhancements, not features currently guaranteed to be available.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the available tests and lint checks.
5. Submit a pull request describing the changes.

For major changes, open an issue first to discuss the proposed improvement.

## 📄 License

A license has not been specified here. Add a `LICENSE` file to the repository before describing the project as open source or permitting reuse under particular terms.

## 👨‍💻 Project

**MathSprint — Learn Math. Calculate Faster.**

Repository: [Math Practice App Android](https://github.com/RupeshVerma28/Math-Practice-App-Android-)

Android build: [Download / View Expo Build](https://expo.dev/accounts/developer75/projects/mathsprint/builds/268769bf-2ebc-452b-be70-dd5c7db92a16)

Built with React Native, Expo, and a focus on accessible, engaging, privacy-conscious mathematics practice.
