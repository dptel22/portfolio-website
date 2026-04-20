with open('portfolio-website/index.html', 'r') as f:
    html = f.read()

assert 'AI/ML ENGINEER &middot; COMPUTER VISION' in html, "Marquee missing"
assert 'Arsenal fan, F1 nerd, strength training 4&times; a week.' in html, "About missing"
assert 'YOLOv11n' in html, "Skills missing"
assert 'Autonomous Road Intelligence Architecture' in html, "Card 1 missing"
assert 'Resolve' in html, "Card 2 missing"
assert 'VitaSakhi' in html, "Card 3 missing"
assert '04' not in html or '<article class="project-card">' not in html.split('<div class="card-number">04</div>')[0], "Card 4 not deleted completely"
assert 'Aspire Leaders Program' in html, "Experience missing"
assert 'dhruvpt933@gmail.com' in html, "Email missing"
print("All checks passed!")
