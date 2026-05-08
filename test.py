#!/usr/bin/env python3
import requests
import json
import argparse
import sys
import re

# API URLs
API_URL = "https://aqualens-froggy-backend.hf.space/api/ask"
SANITY_API_BASE = "https://594hcrq0.api.sanity.io/v2025-04-14/data/query/production?query="

def colorize(text, color):
    """Add color to terminal output"""
    colors = {
        'reset': '\033[0m',
        'green': '\033[92m',
        'blue': '\033[94m',
        'yellow': '\033[93m',
        'cyan': '\033[96m',
        'magenta': '\033[95m',
        'red': '\033[91m',
        'bold': '\033[1m'
    }
    return f"{colors.get(color, '')}{text}{colors['reset']}"

def fetch_sanity_data(query_type="projects"):
    """Directly fetch data from Sanity API to compare with what's used"""
    # Define different queries for different types of data
    queries = {
        "projects": '*[_type == "projects"]{projectName, description, fullText, tags, location, companyOrganization, source}',
        "tags": '*[_type == "tags"]{tagName, description}',
        "locations": '*[_type == "locations"]{locationName, description}',
        "organizations": '*[_type == "organizations"]{orgName, description}',
    }

    query = queries.get(query_type, queries["projects"])
    url = SANITY_API_BASE + requests.utils.quote(query)
    
    try:
        print(colorize(f"Fetching {query_type} data from Sanity API...", "blue"))
        res = requests.get(url)
        res.raise_for_status()
        return res.json()['result']
    except Exception as e:
        print(colorize(f"Error fetching Sanity data: {str(e)}", "red"))
        return []

def determine_query_type(question):
    """Guess the query type based on the question"""
    if "project" in question.lower():
        return "projects"
    elif "tag" in question.lower():
        return "tags"
    elif "location" in question.lower() or "region" in question.lower() or "area" in question.lower():
        return "locations"
    elif "organization" in question.lower() or "company" in question.lower():
        return "organizations"
    else:
        return "projects"  # Default to projects

def send_question(question):
    """Send a question to the Froggy API and return the response"""
    print(colorize(f"\nSending question to API: '{question}'", "blue"))
    print(colorize(f"API URL: {API_URL}", "cyan"))
    
    try:
        response = requests.post(
            API_URL,
            json={"question": question},
            headers={"Content-Type": "application/json"}
        )
        
        # Check if the request was successful
        response.raise_for_status()
        
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(colorize(f"Error making request: {str(e)}", "red"))
        return None

def match_response_with_data(answer, sanity_data, query_type):
    """Try to match the response with data fetched from Sanity"""
    matched_data = []
    
    # Different field names based on query type
    name_field = {
        "projects": "projectName",
        "tags": "tagName",
        "locations": "locationName",
        "organizations": "orgName"
    }.get(query_type, "projectName")
    
    for item in sanity_data:
        # Check if this item's name is mentioned in the answer
        item_name = item.get(name_field, "")
        if item_name and item_name.lower() in answer.lower():
            matched_data.append(item)
            continue
            
        # Check if description is partially included
        description = item.get("description", "")
        if description and len(description) > 10:
            # Check for a significant chunk of description
            desc_chunks = [description[i:i+20] for i in range(0, len(description), 20) if len(description[i:i+20]) == 20]
            for chunk in desc_chunks[:5]:  # Check first 5 chunks only
                if chunk.lower() in answer.lower():
                    matched_data.append(item)
                    break
        
        # For projects, also check full text
        if query_type == "projects":
            full_text = item.get("fullText", "")
            if full_text and len(full_text) > 20:
                text_chunks = [full_text[i:i+30] for i in range(0, len(full_text), 30) if len(full_text[i:i+30]) == 30]
                for chunk in text_chunks[:3]:  # Check first 3 chunks only
                    if chunk.lower() in answer.lower():
                        matched_data.append(item)
                        break
    
    return matched_data

def create_data_report(matched_data, query_type):
    """Create a readable report from the matched data"""
    if not matched_data:
        return "No matching data found in the response. The model may have used general knowledge or the data wasn't explicitly mentioned."
    
    name_field = {
        "projects": "projectName",
        "tags": "tagName",
        "locations": "locationName",
        "organizations": "orgName"
    }.get(query_type, "projectName")
    
    reports = []
    for i, item in enumerate(matched_data):
        report = [colorize(f"\nItem {i+1}: {item.get(name_field, 'Unnamed')}", "bold")]
        
        # Add description
        if "description" in item:
            desc = item["description"]
            report.append(f"Description: {desc[:100]}..." if len(desc) > 100 else f"Description: {desc}")
        
        # For projects, add source and other information
        if query_type == "projects":
            if "source" in item:
                report.append(f"Source: {item['source']}")
            if "companyOrganization" in item:
                report.append(f"Organization: {item['companyOrganization']}")
            if "location" in item:
                report.append(f"Location: {item['location']}")
            if "tags" in item and item["tags"]:
                report.append(f"Tags: {', '.join(item['tags'])}")
        
        reports.append("\n".join(report))
    
    return "\n".join(reports)

def interactive_mode():
    """Run the client in interactive mode"""
    print(colorize("Welcome to the Froggy API Test Client!", "green"))
    print(colorize("Type your questions and press Enter. Type 'exit' to quit.", "green"))
    
    while True:
        try:
            question = input(colorize("\nQuestion: ", "yellow"))
            
            if question.lower() in ('exit', 'quit', 'q'):
                print(colorize("Exiting Froggy test client. Goodbye!", "green"))
                break
                
            if not question.strip():
                continue
            
            # Guess the query type
            query_type = determine_query_type(question)
            print(colorize(f"Determined query type: {query_type}", "blue"))
            
            # Fetch Sanity data for this query type
            sanity_data = fetch_sanity_data(query_type)
            print(colorize(f"Fetched {len(sanity_data)} items from Sanity API", "blue"))
            
            # Send the question to the API
            result = send_question(question)
            
            if result:
                answer = result.get("answer", "No answer received")
                
                print(colorize("\n=== RESPONSE ===", "magenta"))
                print(colorize(answer, "cyan"))
                
                # Match the response with the fetched data
                matched_data = match_response_with_data(answer, sanity_data, query_type)
                
                print(colorize(f"\n=== DATA USED ({len(matched_data)} ITEMS MATCHED) ===", "magenta"))
                data_report = create_data_report(matched_data, query_type)
                print(colorize(data_report, "yellow"))
        
        except KeyboardInterrupt:
            print(colorize("\nExiting Froggy test client. Goodbye!", "green"))
            break
        except Exception as e:
            print(colorize(f"Error: {str(e)}", "red"))

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Test client for the Froggy API')
    parser.add_argument('-q', '--question', help='Question to ask (if not provided, runs in interactive mode)')
    parser.add_argument('-t', '--type', choices=['projects', 'tags', 'locations', 'organizations'], 
                        help='Force a specific query type instead of auto-detecting')
    parser.add_argument('-r', '--raw', action='store_true', help='Display raw JSON response')
    return parser.parse_args()

def main():
    args = parse_args()
    
    if args.question:
        # Single question mode
        # Determine query type
        query_type = args.type or determine_query_type(args.question)
        print(colorize(f"Using query type: {query_type}", "blue"))
        
        # Fetch Sanity data for this query type
        sanity_data = fetch_sanity_data(query_type)
        print(colorize(f"Fetched {len(sanity_data)} items from Sanity API", "blue"))
        
        # Send the question to the API
        result = send_question(args.question)
        
        if result:
            answer = result.get("answer", "No answer received")
            
            print(colorize("\n=== RESPONSE ===", "magenta"))
            print(colorize(answer, "cyan"))
            
            # Match the response with the fetched data
            matched_data = match_response_with_data(answer, sanity_data, query_type)
            
            print(colorize(f"\n=== DATA USED ({len(matched_data)} ITEMS MATCHED) ===", "magenta"))
            data_report = create_data_report(matched_data, query_type)
            print(colorize(data_report, "yellow"))
            
            if args.raw:
                print(colorize("\n=== RAW API RESPONSE ===", "magenta"))
                print(json.dumps(result, indent=2))
    else:
        # Interactive mode
        interactive_mode()

if __name__ == "__main__":
    main()