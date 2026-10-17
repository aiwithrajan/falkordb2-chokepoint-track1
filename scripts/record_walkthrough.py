import asyncio
import os
import shutil
from playwright.async_api import async_playwright

async def record_demo():
    output_dir = os.path.abspath("demo_video")
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    print("🚀 Launching Playwright Chromium in Full HD (1920x1080)...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--window-size=1920,1080",
                "--no-sandbox",
                "--disable-dev-shm-usage"
            ]
        )

        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=output_dir,
            record_video_size={"width": 1920, "height": 1080}
        )

        page = await context.new_page()

        print("🌐 Navigating to ChokePoint (http://localhost:5174)...")
        await page.goto("http://localhost:5174", wait_until="networkidle")
        await asyncio.sleep(2)

        # -------------------------------------------------------------
        # Scene 1: Kinetic Hero & The Problem
        # -------------------------------------------------------------
        print("🎬 Scene 1: Hero & Problem Overview...")
        await page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")
        await asyncio.sleep(3)

        # Smooth scroll to Problem section
        await page.evaluate("window.scrollBy({top: 650, behavior: 'smooth'})")
        await asyncio.sleep(3.5)

        # -------------------------------------------------------------
        # Scene 2: Technology & Latency Benchmark Bento Grid
        # -------------------------------------------------------------
        print("🎬 Scene 2: FalkorDB GraphBLAS Technology & Bento Grid...")
        tech_btn = page.locator("button:has-text('TECHNOLOGY')")
        if await tech_btn.count() > 0:
            await tech_btn.first.click()
        else:
            await page.evaluate("window.scrollBy({top: 900, behavior: 'smooth'})")
        await asyncio.sleep(2.5)

        # Scroll to benchmark chart
        await page.evaluate("window.scrollBy({top: 450, behavior: 'smooth'})")
        await asyncio.sleep(4)

        # -------------------------------------------------------------
        # Scene 3: Autonomous War Room Console
        # -------------------------------------------------------------
        print("🎬 Scene 3: Entering Autonomous War Room...")
        war_room_btn = page.locator("button:has-text('WAR ROOM')")
        await war_room_btn.first.click()
        await asyncio.sleep(2.5)

        # Trigger ChokePoint Agent
        print("⚡ Clicking 'Run ChokePoint Agent'...")
        run_btn = page.locator("button:has-text('Run ChokePoint Agent')")
        await run_btn.click()

        # Watch telemetry stream
        print("📊 Telemetry streaming in real-time...")
        await asyncio.sleep(3.5)

        # Cytoscape Graph interaction
        print("🕸️ Viewing Cytoscape Connected Graph & Min-Cut Halo...")
        canvas = page.locator("#cy, canvas")
        if await canvas.count() > 0:
            box = await canvas.first.bounding_box()
            if box:
                # Hover near the center
                await page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        await asyncio.sleep(3)

        # Open Approval Gate & 1-Click PR Diff
        print("📝 Clicking 'Approve & Export 1-Click PR'...")
        approve_btn = page.locator("button:has-text('Approve & Export 1-Click PR')")
        if await approve_btn.count() > 0:
            await approve_btn.click()
            await asyncio.sleep(3.5)
            # Click Apply & Export PR Diff to confirm and close modal
            apply_btn = page.locator("button:has-text('Apply & Export PR Diff')")
            if await apply_btn.count() > 0:
                await apply_btn.first.click()
            else:
                cancel_btn = page.locator("button:has-text('Cancel')")
                await cancel_btn.first.click()
            await asyncio.sleep(2)

        # -------------------------------------------------------------
        # Scene 4: Real-Time Exploit Simulator
        # -------------------------------------------------------------
        print("🎬 Scene 4: Real-Time Exploit Simulator...")
        sim_btn = page.locator("button:has-text('SIMULATOR')")
        await sim_btn.first.click()
        await asyncio.sleep(2.5)

        # Launch Multi-Hop Attack Wave
        print("🚨 Launching Multi-Hop Attack Wave...")
        launch_btn = page.locator("button:has-text('Launch Multi-Hop Attack Wave')")
        if await launch_btn.count() > 0:
            await launch_btn.click()
            print("⏳ Awaiting attack propagation across hops...")
            await asyncio.sleep(4.5)

        # Engage FalkorDB Min-Cut Defense Shield
        print("🛡️ Engaging FalkorDB Min-Cut Defense (1-Click Sever)...")
        defense_btn = page.locator("button:has-text('Engage FalkorDB Min-Cut Defense')")
        if await defense_btn.count() > 0:
            await defense_btn.click()
            print("✨ Attack severed at bottleneck! Shield active.")
            await asyncio.sleep(5)

        # -------------------------------------------------------------
        # Scene 5: Rule 3 Ablation Benchmark Modal & Wrap Up
        # -------------------------------------------------------------
        print("🎬 Scene 5: Rule 3 Ablation Benchmark Modal...")
        proof_btn = page.locator("button:has-text('PROOF')")
        if await proof_btn.count() > 0:
            await proof_btn.first.click()
            await asyncio.sleep(4)
            # Close modal with X button
            x_btn = page.locator("div.fixed button:has(svg.lucide-x)")
            if await x_btn.count() > 0:
                await x_btn.first.click()
            await asyncio.sleep(1.5)

        print("🎬 Returning to War Room for final hero view...")
        await war_room_btn.first.click()
        await asyncio.sleep(3)

        # Grab video handle before closing
        video = page.video
        await page.close()
        await context.close()
        await browser.close()

        if video:
            video_path = await video.path()
            final_dest = os.path.join(output_dir, "chokepoint_walkthrough.webm")
            if os.path.exists(video_path):
                shutil.copy(video_path, final_dest)
                file_size_mb = os.path.getsize(final_dest) / (1024 * 1024)
                print(f"🎉 Video successfully recorded and saved to: {final_dest} ({file_size_mb:.2f} MB)")
            else:
                print(f"Video file located at: {video_path}")
        else:
            print("No video handle found.")

if __name__ == "__main__":
    asyncio.run(record_demo())
