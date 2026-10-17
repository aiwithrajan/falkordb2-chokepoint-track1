import asyncio
import json
import os
import shutil
import subprocess
from playwright.async_api import async_playwright

FFMPEG = "/Users/apple/Downloads/falkordb2/.venv/lib/python3.9/site-packages/static_ffmpeg/bin/darwin/ffmpeg"
FFPROBE = "/Users/apple/Downloads/falkordb2/.venv/lib/python3.9/site-packages/static_ffmpeg/bin/darwin/ffprobe"

VOICE_SECTIONS = [
    {
        "id": "scene1",
        "text": (
            "Welcome to ChokePoint, an autonomous supply-chain remediation agent powered by FalkorDB. "
            "Every software engineer dreads opening their repository and seeing fifty separate Dependabot or Snyk alerts. "
            "Upgrading every transitive dependency blindly breaks production CI CD and creates massive alert fatigue. "
            "ChokePoint solves this by finding the single upstream bottleneck that neutralizes all threats."
        ),
    },
    {
        "id": "scene2",
        "text": (
            "Why is FalkorDB essential here? Relational SQL fails at deep recursive joins, and Vector databases cannot calculate flow conservation. "
            "ChokePoint models the dependency tree as a directed flow network in FalkorDB. "
            "Using native GraphBLAS sparse matrix operations, our agent runs algo maxFlow in just fifteen milliseconds, thirty times faster than traditional methods."
        ),
    },
    {
        "id": "scene3",
        "text": (
            "Inside our Autonomous War Room, we inspect a real target like express. "
            "When we launch the agent, it executes a six-step decide-and-act loop directly on FalkorDB. "
            "It uncovers deep transitive CVEs, identifies body-parser as the exact choke-point, and uses FalkorDB's instant GRAPH.COPY to verify in memory that residual attack flow drops to zero."
        ),
    },
    {
        "id": "scene4",
        "text": (
            "Before touching production, ChokePoint halts at our Human Reversibility Gate. "
            "Maintainers can inspect the verified proof and export a clean, one-click pull request diff with package overrides, severing all attack paths with zero breaking changes."
        ),
    },
    {
        "id": "scene5",
        "text": (
            "In our Exploit Simulator, we can watch this protection live. "
            "When a threat actor launches an attack wave, malicious payloads travel down the dependency chain toward the root application. "
            "When we engage the FalkorDB ChokePoint defense shield, the bottleneck severs the flow, dropping vulnerability traffic to absolute zero."
        ),
    },
    {
        "id": "scene6",
        "text": (
            "Our empirical benchmarks show a ninety-seven percent reduction in developer alert fatigue. "
            "Built on the official FastMCP standard, ChokePoint proves that FalkorDB makes autonomous cybersecurity fast, deterministic, and verifiable. "
            "Thank you for watching!"
        ),
    },
]

def get_duration(audio_file: str) -> float:
    cmd = [
        FFPROBE,
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        audio_file
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return float(res.stdout.strip())

def generate_voiceover(audio_dir: str):
    os.makedirs(audio_dir, exist_ok=True)
    wav_files = []
    durations = {}

    print("🎙️ Generating normal-pitch voiceover using macOS Daniel...")
    for idx, sec in enumerate(VOICE_SECTIONS):
        sec_id = sec["id"]
        aiff_path = os.path.join(audio_dir, f"{sec_id}.aiff")
        wav_path = os.path.join(audio_dir, f"{sec_id}.wav")

        # Use Daniel voice, rate 165 for normal natural speed
        cmd_say = ["say", "-v", "Daniel", "-r", "165", "-o", aiff_path, sec["text"]]
        subprocess.run(cmd_say, check=True)

        # Convert to standard WAV with high quality
        cmd_conv = [FFMPEG, "-y", "-i", aiff_path, "-ar", "44100", "-ac", "2", wav_path]
        subprocess.run(cmd_conv, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

        dur = get_duration(wav_path)
        durations[sec_id] = dur
        wav_files.append(wav_path)
        print(f"  ✓ {sec_id}: {dur:.2f}s generated")

    # Concatenate all wav files into one master narration track
    concat_list = os.path.join(audio_dir, "concat.txt")
    with open(concat_list, "w") as f:
        for wf in wav_files:
            f.write(f"file '{wf}'\n")

    master_audio = os.path.join(audio_dir, "master_narration.wav")
    cmd_cat = [FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", master_audio]
    subprocess.run(cmd_cat, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    total_dur = get_duration(master_audio)
    print(f"🎵 Master Voiceover compiled: {total_dur:.2f}s ({master_audio})")

    return durations, master_audio

async def record_synced_video(durations: dict, temp_video_dir: str):
    os.makedirs(temp_video_dir, exist_ok=True)
    print("\n🎥 Launching Playwright to record frame-synced 1080p video...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--window-size=1920,1080", "--no-sandbox", "--disable-dev-shm-usage"]
        )

        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=temp_video_dir,
            record_video_size={"width": 1920, "height": 1080}
        )

        page = await context.new_page()
        await page.goto("http://localhost:5174", wait_until="networkidle")
        await asyncio.sleep(1)

        # Scene 1: Hero & Problem Overview
        print(f"🎬 Scene 1: Hero & The Problem ({durations['scene1']:.1f}s)...")
        await page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")
        await asyncio.sleep(durations["scene1"] * 0.5)
        # Scroll to Problem card
        await page.evaluate("window.scrollBy({top: 650, behavior: 'smooth'})")
        await asyncio.sleep(durations["scene1"] * 0.5 + 0.5)

        # Scene 2: Technology & Latency Benchmark Bento Grid
        print(f"🎬 Scene 2: Technology Bento Grid ({durations['scene2']:.1f}s)...")
        tech_btn = page.locator("button:has-text('TECHNOLOGY')")
        if await tech_btn.count() > 0:
            await tech_btn.first.click()
        await asyncio.sleep(1.5)
        await page.evaluate("window.scrollBy({top: 400, behavior: 'smooth'})")
        await asyncio.sleep(durations["scene2"] - 1.0)

        # Scene 3: War Room Console & Live Ingestion / Cut
        print(f"🎬 Scene 3: Autonomous War Room Live ({durations['scene3']:.1f}s)...")
        war_room_btn = page.locator("button:has-text('WAR ROOM')")
        await war_room_btn.first.click()
        await asyncio.sleep(2)

        run_btn = page.locator("button:has-text('Run ChokePoint Agent')")
        await run_btn.click()
        await asyncio.sleep(3)

        # Cytoscape hover
        canvas = page.locator("#cy, canvas")
        if await canvas.count() > 0:
            box = await canvas.first.bounding_box()
            if box:
                await page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        await asyncio.sleep(durations["scene3"] - 5.0)

        # Scene 4: Approval Gate & 1-Click PR Diff
        print(f"🎬 Scene 4: Approval Gate & PR Export ({durations['scene4']:.1f}s)...")
        approve_btn = page.locator("button:has-text('Approve & Export 1-Click PR')")
        if await approve_btn.count() > 0:
            await approve_btn.click()
            await asyncio.sleep(durations["scene4"] * 0.6)
            apply_btn = page.locator("button:has-text('Apply & Export PR Diff')")
            if await apply_btn.count() > 0:
                await apply_btn.first.click()
            else:
                await page.locator("button:has-text('Cancel')").first.click()
            await asyncio.sleep(durations["scene4"] * 0.4)

        # Scene 5: Real-Time Exploit Simulator
        print(f"🎬 Scene 5: Exploit Simulator ({durations['scene5']:.1f}s)...")
        sim_btn = page.locator("button:has-text('SIMULATOR')")
        await sim_btn.first.click()
        await asyncio.sleep(2)

        launch_btn = page.locator("button:has-text('Launch Multi-Hop Attack Wave')")
        if await launch_btn.count() > 0:
            await launch_btn.click()
            await asyncio.sleep(5)

        defense_btn = page.locator("button:has-text('Engage FalkorDB Min-Cut Defense')")
        if await defense_btn.count() > 0:
            await defense_btn.click()
            await asyncio.sleep(durations["scene5"] - 7.0)

        # Scene 6: Rule 3 Ablation Benchmark Modal & Wrap Up
        print(f"🎬 Scene 6: Rule 3 Benchmark & Wrap Up ({durations['scene6']:.1f}s)...")
        proof_btn = page.locator("button:has-text('PROOF')")
        if await proof_btn.count() > 0:
            await proof_btn.first.click()
            await asyncio.sleep(durations["scene6"] * 0.6)
            x_btn = page.locator("div.fixed button:has(svg.lucide-x)")
            if await x_btn.count() > 0:
                await x_btn.first.click()
            await asyncio.sleep(1)

        await war_room_btn.first.click()
        await asyncio.sleep(durations["scene6"] * 0.4)

        # Close and flush video
        video = page.video
        await page.close()
        await context.close()
        await browser.close()

        raw_video_path = await video.path()
        return raw_video_path

def merge_audio_video(raw_video: str, master_audio: str, output_mp4: str, output_webm: str):
    print("\n🎞️ Merging High-Definition Video with Voiceover Track...")

    # Output 1: MP4 (H.264 + AAC, universally playable on Mac, QuickTime, YouTube, Phone)
    cmd_mp4 = [
        FFMPEG, "-y",
        "-i", raw_video,
        "-i", master_audio,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_mp4
    ]
    subprocess.run(cmd_mp4, check=True)

    # Output 2: WebM (VP8/VP9 + Opus, native web container)
    cmd_webm = [
        FFMPEG, "-y",
        "-i", raw_video,
        "-i", master_audio,
        "-c:v", "copy",
        "-c:a", "libopus",
        "-b:a", "128k",
        "-shortest",
        output_webm
    ]
    try:
        subprocess.run(cmd_webm, check=True)
    except Exception:
        # Fallback to standard webm muxing
        cmd_webm_fallback = [
            FFMPEG, "-y",
            "-i", raw_video,
            "-i", master_audio,
            "-shortest",
            output_webm
        ]
        subprocess.run(cmd_webm_fallback, check=True)

    mp4_size = os.path.getsize(output_mp4) / (1024 * 1024)
    print(f"🎉 MASTER NARRATED VIDEO READY!")
    print(f"  👉 MP4 Version:  {output_mp4} ({mp4_size:.2f} MB)")
    print(f"  👉 WebM Version: {output_webm}")

def main():
    base_dir = os.path.abspath("demo_video")
    audio_dir = os.path.join(base_dir, "audio")
    temp_video_dir = os.path.join(base_dir, "temp_video")

    durations, master_audio = generate_voiceover(audio_dir)
    raw_video = asyncio.run(record_synced_video(durations, temp_video_dir))

    output_mp4 = os.path.join(base_dir, "chokepoint_demo_narrated.mp4")
    output_webm = os.path.join(base_dir, "chokepoint_demo_narrated.webm")

    merge_audio_video(raw_video, master_audio, output_mp4, output_webm)

if __name__ == "__main__":
    main()
