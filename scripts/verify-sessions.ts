import { MOOD_OPTIONS, MOOD_PHASES, AMBIENT_SOUNDS } from '../src/data/contentManifest';
import { MoodId } from '../src/types';

function runVerification() {
  console.log('=============================================');
  console.log('   SLEEPZEN SPECIFICATION VERIFICATION      ');
  console.log('=============================================');
  let passCount = 0;
  let failCount = 0;

  // 1. Check Mood Options (4 required)
  console.log('\n[1] Checking 4 Core Mood States:');
  const expectedMoods: MoodId[] = ['racing-thoughts', 'stressed-tense', 'restless', 'sleepy-awake'];
  if (MOOD_OPTIONS.length === 4) {
    console.log(`  ✓ Exactly 4 mood options defined`);
    passCount++;
  } else {
    console.error(`  ✗ Expected 4 moods, found ${MOOD_OPTIONS.length}`);
    failCount++;
  }

  expectedMoods.forEach((mId) => {
    const found = MOOD_OPTIONS.find((m) => m.id === mId);
    if (found) {
      console.log(`  ✓ Mood verified: "${found.title}" (${found.shortLabel})`);
      passCount++;
    } else {
      console.error(`  ✗ Missing mood: ${mId}`);
      failCount++;
    }
  });

  // 2. Check 4 Ambient Soundscapes
  console.log('\n[2] Checking 4 Ambient Soundscapes:');
  const expectedSounds = ['rain', 'ocean', 'forest', 'pink-noise'];
  expectedSounds.forEach((id) => {
    const found = AMBIENT_SOUNDS.find((s) => s.id === id);
    if (found) {
      console.log(`  ✓ Soundscape verified: ${found.name} ("${found.subtitle}")`);
      passCount++;
    } else {
      console.error(`  ✗ Missing soundscape: ${id}`);
      failCount++;
    }
  });

  // 3. Check Session Matrix (4 moods × 3 lengths = 12 combinations)
  console.log('\n[3] Checking Session Matrix (12 combinations):');
  const durations = [5, 10, 20];

  MOOD_OPTIONS.forEach((mood) => {
    const phases = MOOD_PHASES[mood.id];
    if (!phases || phases.length === 0) {
      console.error(`  ✗ No phases defined for mood: ${mood.id}`);
      failCount++;
      return;
    }

    console.log(`\n• Checking Mood: ${mood.title}`);
    console.log(`  Composition: ${mood.compositionDescription}`);
    console.log(`  Phases defined: ${phases.length}`);

    // Verify start and end points
    if (phases[0].startPercent === 0) {
      console.log(`  ✓ Starts at 0% (${phases[0].title})`);
      passCount++;
    } else {
      console.error(`  ✗ First phase does not start at 0%`);
      failCount++;
    }

    const lastPhase = phases[phases.length - 1];
    if (lastPhase.endPercent === 100) {
      console.log(`  ✓ Ends at 100% (${lastPhase.title})`);
      passCount++;
    } else {
      console.error(`  ✗ Last phase does not end at 100%`);
      failCount++;
    }

    // Verify all durations
    durations.forEach((dur) => {
      const totalSecs = dur * 60;
      let prevEnd = 0;

      phases.forEach((phase) => {
        if (phase.startPercent < prevEnd) {
          console.error(`  ✗ Overlapping phase: ${phase.title}`);
          failCount++;
        }
        prevEnd = phase.endPercent;

        const phaseSecs = Math.round(((phase.endPercent - phase.startPercent) / 100) * totalSecs);
        if (phaseSecs <= 0) {
          console.error(`  ✗ Zero or negative duration for ${phase.title} at ${dur}m`);
          failCount++;
        }
      });

      console.log(`  ✓ Duration ${dur} min (${totalSecs}s) mapped cleanly across ${phases.length} phases`);
      passCount++;
    });
  });

  console.log('\n=============================================');
  console.log(`VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=============================================');
  if (failCount > 0) {
    process.exit(1);
  }
}

runVerification();
