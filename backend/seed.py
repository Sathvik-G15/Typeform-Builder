import json
import random
from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app import models

def run_seed():
    print("Dropping existing tables and creating fresh schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Form 1: Customer Feedback & NPS Survey (Published)...")
        form1 = models.Form(
            title="Customer Feedback & NPS Survey",
            description="Help us shape the future of our product by sharing your honest feedback.",
            slug="customer-feedback-survey",
            is_published=True,
            theme_config=json.dumps({
                "primaryColor": "#0445FE",
                "backgroundColor": "#FFFFFF",
                "font": "Inter"
            }),
            welcome_screen_json=json.dumps({
                "enabled": True,
                "title": "Welcome to our Customer Feedback Survey",
                "description": "Takes only 2 minutes. Your responses directly influence our product roadmap.",
                "buttonText": "Start Survey"
            }),
            thank_you_screen_json=json.dumps({
                "title": "Thank you for your feedback!",
                "description": "We read every single submission and genuinely appreciate your time.",
                "buttonText": "Back to Home"
            })
        )
        db.add(form1)
        db.flush()

        # Questions for Form 1
        q1_1 = models.Question(
            form_id=form1.id,
            type="rating",
            title="How would you rate your overall satisfaction with our product?",
            description="On a scale of 1 (poor) to 5 (excellent)",
            is_required=True,
            order_index=0,
            options_json="[]",
            properties_json=json.dumps({"rating_max": 5, "shape": "star"})
        )
        q1_2 = models.Question(
            form_id=form1.id,
            type="multiple_choice",
            title="Which product feature do you rely on the most?",
            description="Select the one that brings you the most value",
            is_required=True,
            order_index=1,
            options_json=json.dumps([
                "Real-time Analytics Dashboard",
                "Automated Reporting",
                "Third-party API Integrations",
                "Collaboration & Team Workspaces"
            ]),
            properties_json="{}"
        )
        q1_3 = models.Question(
            form_id=form1.id,
            type="yes_no",
            title="Would you recommend our platform to a peer or coworker?",
            description="Help us calculate our Net Promoter Score",
            is_required=True,
            order_index=2,
            options_json="[]",
            properties_json="{}"
        )
        q1_4 = models.Question(
            form_id=form1.id,
            type="dropdown",
            title="What industry best describes your company?",
            description="Choose your organization's domain",
            is_required=False,
            order_index=3,
            options_json=json.dumps([
                "Software & SaaS",
                "Financial Services & FinTech",
                "E-Commerce & Retail",
                "Healthcare & Biotech",
                "Education & EdTech",
                "Other"
            ]),
            properties_json="{}"
        )
        q1_5 = models.Question(
            form_id=form1.id,
            type="long_text",
            title="What is one improvement that would make the product indispensable to you?",
            description="Feel free to be as detailed as you like",
            is_required=False,
            order_index=4,
            options_json="[]",
            properties_json=json.dumps({"placeholder": "Share your thoughts here..."})
        )
        q1_6 = models.Question(
            form_id=form1.id,
            type="email",
            title="What is your email address?",
            description="Optional — only if you would like our product team to follow up with you",
            is_required=False,
            order_index=5,
            options_json="[]",
            properties_json=json.dumps({"placeholder": "alex@company.com"})
        )

        db.add_all([q1_1, q1_2, q1_3, q1_4, q1_5, q1_6])
        db.flush()

        # Seed 12 realistic responses for Form 1
        sample_responses_data = [
            ("5", "Real-time Analytics Dashboard", "Yes", "Software & SaaS", "Faster query filters would make it 10/10.", "alex.turner@techwave.io", 45),
            ("4", "Automated Reporting", "Yes", "Financial Services & FinTech", "Love the PDF exports, keep expanding schedule options.", "maya.lin@capitaledge.com", 62),
            ("5", "Third-party API Integrations", "Yes", "Software & SaaS", "Webhook retry mechanisms would be awesome.", "dev@buildfast.dev", 38),
            ("3", "Collaboration & Team Workspaces", "No", "E-Commerce & Retail", "Permissions could be more granular.", "", 80),
            ("5", "Real-time Analytics Dashboard", "Yes", "Healthcare & Biotech", "Very clean UX, easiest tool we've onboarded this year.", "sarah.connor@biohealth.org", 50),
            ("4", "Real-time Analytics Dashboard", "Yes", "Software & SaaS", "Dark mode in analytics would be great.", "kevin@startup.io", 42),
            ("2", "Automated Reporting", "No", "Other", "A bit sluggish on huge datasets.", "", 95),
            ("5", "Third-party API Integrations", "Yes", "Software & SaaS", "Documentation is top tier.", "elena@cloudscale.net", 33),
            ("4", "Collaboration & Team Workspaces", "Yes", "Education & EdTech", "Great UI, students and TAs love it.", "prof.patel@edu.ac.in", 55),
            ("5", "Real-time Analytics Dashboard", "Yes", "Financial Services & FinTech", "Replaced two legacy tools with this one.", "marcus@fininvest.com", 49),
            ("4", "Automated Reporting", "Yes", "Software & SaaS", "Weekly digests are super useful.", "", 40),
            ("5", "Real-time Analytics Dashboard", "Yes", "Software & SaaS", "Unbelievable speed and aesthetic polish.", "clara@modernweb.design", 29)
        ]

        now = datetime.utcnow()
        for idx, (r_rating, r_feat, r_yn, r_ind, r_feedback, r_email, duration) in enumerate(sample_responses_data):
            resp = models.Response(
                form_id=form1.id,
                submitted_at=now - timedelta(days=random.randint(0, 10), hours=random.randint(1, 23)),
                time_spent_seconds=duration,
                metadata_json=json.dumps({"browser": "Chrome 122.0", "platform": "Desktop"})
            )
            db.add(resp)
            db.flush()

            db.add(models.Answer(response_id=resp.id, question_id=q1_1.id, value=r_rating))
            db.add(models.Answer(response_id=resp.id, question_id=q1_2.id, value=r_feat))
            db.add(models.Answer(response_id=resp.id, question_id=q1_3.id, value=r_yn))
            if r_ind:
                db.add(models.Answer(response_id=resp.id, question_id=q1_4.id, value=r_ind))
            if r_feedback:
                db.add(models.Answer(response_id=resp.id, question_id=q1_5.id, value=r_feedback))
            if r_email:
                db.add(models.Answer(response_id=resp.id, question_id=q1_6.id, value=r_email))

        print("Seeding Form 2: Tech Lead & Senior Developer Application (Published)...")
        form2 = models.Form(
            title="Senior Full-Stack Engineer Application",
            description="We are hiring experienced engineers passionate about craft, performance, and clean architecture.",
            slug="senior-fullstack-engineer",
            is_published=True,
            theme_config=json.dumps({
                "primaryColor": "#10B981",
                "backgroundColor": "#FFFFFF",
                "font": "Inter"
            }),
            welcome_screen_json=json.dumps({
                "enabled": True,
                "title": "Welcome to the Engineering Application",
                "description": "5 quick questions so we can get to know your background.",
                "buttonText": "Start Application"
            }),
            thank_you_screen_json=json.dumps({
                "title": "Application Received!",
                "description": "Our engineering leadership reviews submissions weekly. We'll be in touch.",
                "buttonText": "View Openings"
            })
        )
        db.add(form2)
        db.flush()

        q2_1 = models.Question(
            form_id=form2.id,
            type="short_text",
            title="What is your full name?",
            description="Please enter your first and last name",
            is_required=True,
            order_index=0,
            options_json="[]",
            properties_json=json.dumps({"placeholder": "Grace Hopper"})
        )
        q2_2 = models.Question(
            form_id=form2.id,
            type="email",
            title="What is your preferred email address?",
            description="Where our talent team can reach out to you",
            is_required=True,
            order_index=1,
            options_json="[]",
            properties_json=json.dumps({"placeholder": "grace@cs.navy.mil"})
        )
        q2_3 = models.Question(
            form_id=form2.id,
            type="number",
            title="How many years of professional software engineering experience do you have?",
            description="Total full-time experience",
            is_required=True,
            order_index=2,
            options_json="[]",
            properties_json=json.dumps({"placeholder": "5"})
        )
        q2_4 = models.Question(
            form_id=form2.id,
            type="multiple_choice",
            title="Which backend architecture do you feel most productive building with?",
            description="Select your strongest focus",
            is_required=True,
            order_index=3,
            options_json=json.dumps([
                "Python (FastAPI / Django / AsyncIO)",
                "TypeScript & Node / Next.js API",
                "Go (Gin / Chi / Goroutines)",
                "Java / Kotlin (Spring Boot / Micronaut)"
            ]),
            properties_json="{}"
        )
        q2_5 = models.Question(
            form_id=form2.id,
            type="rating",
            title="How would you self-rate your comfort with end-to-end type safety (TypeScript + Pydantic)?",
            description="Scale of 1 (basic) to 5 (expert)",
            is_required=True,
            order_index=4,
            options_json="[]",
            properties_json=json.dumps({"rating_max": 5, "shape": "star"})
        )

        db.add_all([q2_1, q2_2, q2_3, q2_4, q2_5])
        db.flush()

        candidates = [
            ("David Kim", "david.kim@gmail.com", "6", "Python (FastAPI / Django / AsyncIO)", "5", 55),
            ("Rachel Adams", "radams@outlook.com", "8", "TypeScript & Node / Next.js API", "5", 60),
            ("Arjun Verma", "arjun.v@techie.in", "4", "Python (FastAPI / Django / AsyncIO)", "4", 45),
            ("Sophia Chen", "schen@berkeley.edu", "5", "Go (Gin / Chi / Goroutines)", "4", 52),
            ("Liam O'Connor", "liam.oc@dublin.io", "7", "Python (FastAPI / Django / AsyncIO)", "5", 40),
            ("Jessica Taylor", "jtaylor@devmail.com", "9", "Java / Kotlin (Spring Boot / Micronaut)", "3", 75),
            ("Hassan Ali", "hassan.ali@cairo.tech", "5", "TypeScript & Node / Next.js API", "5", 48),
            ("Emma Watson", "em.watson@londoncode.co.uk", "6", "Python (FastAPI / Django / AsyncIO)", "4", 58)
        ]

        for name, email, yoe, stack, rating, duration in candidates:
            c_resp = models.Response(
                form_id=form2.id,
                submitted_at=now - timedelta(days=random.randint(0, 5), hours=random.randint(1, 12)),
                time_spent_seconds=duration,
                metadata_json=json.dumps({"browser": "Firefox 124.0", "platform": "Desktop"})
            )
            db.add(c_resp)
            db.flush()

            db.add(models.Answer(response_id=c_resp.id, question_id=q2_1.id, value=name))
            db.add(models.Answer(response_id=c_resp.id, question_id=q2_2.id, value=email))
            db.add(models.Answer(response_id=c_resp.id, question_id=q2_3.id, value=yoe))
            db.add(models.Answer(response_id=c_resp.id, question_id=q2_4.id, value=stack))
            db.add(models.Answer(response_id=c_resp.id, question_id=q2_5.id, value=rating))

        print("Seeding Form 3: Employee Engagement Pulse Check (Draft)...")
        form3 = models.Form(
            title="Q2 Employee Engagement Pulse Check",
            description="Internal quarterly survey to assess team morale and cross-functional alignment.",
            slug="q2-employee-pulse-check",
            is_published=False,  # DRAFT
            theme_config=json.dumps({
                "primaryColor": "#6366F1",
                "backgroundColor": "#FFFFFF",
                "font": "Inter"
            })
        )
        db.add(form3)
        db.flush()

        q3_1 = models.Question(
            form_id=form3.id,
            type="rating",
            title="How energized do you feel about your current sprint goals?",
            is_required=True,
            order_index=0,
            options_json="[]",
            properties_json=json.dumps({"rating_max": 5, "shape": "star"})
        )
        q3_2 = models.Question(
            form_id=form3.id,
            type="yes_no",
            title="Do you feel you have the resources necessary to do your best work?",
            is_required=True,
            order_index=1,
            options_json="[]",
            properties_json="{}"
        )
        db.add_all([q3_1, q3_2])

        db.commit()
        print("Database seeded successfully with 3 rich forms and 20 sample responses!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
