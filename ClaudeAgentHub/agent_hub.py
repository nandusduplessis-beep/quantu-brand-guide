import os

# Path to the directory containing agents
AGENTS_DIR = os.path.expanduser("~/.claude/agents/")
CATEGORIES = ["marketing", "engineering", "specialized", "product"]

def list_agents():
    """List all agents under organized categories."""
    print("\n---- Available Agents ----")
    for category in CATEGORIES:
        category_path = os.path.join(AGENTS_DIR, category)
        if os.path.exists(category_path):
            print(f"\nCategory: {category.capitalize()}")
            agents = [
                f"- {agent[:-3].replace('-', ' ').title()}"
                for agent in os.listdir(category_path)
                if agent.endswith(".md")
            ]
            print("\n".join(agents))
        else:
            print(f"\nCategory: {category.capitalize()} (No agents found)")

def activate_agent(agent_name):
    """
    Simulate activating an agent. Modify below logic for actual integration with Claude.
    """
    print("\nActivating Agent...")
    print(f"Agent Name: {agent_name}")
    print("Add your specific task-specific activation logic here (e.g., call Claude API).")

def main():
    print("\n=== Claude Agent Hub ===")
    print("Describe your task or choose from the list of agents.")

    option = input("Enter '1' to list agents or '2' to describe your problem: ").strip()
    if option == "1":
        list_agents()
    elif option == "2":
        problem = input("\nDescribe your problem (e.g., 'Build a social media hub'): ").strip().lower()
        print("\nMatching Agents Below...")

        if "social media" in problem or "marketing" in problem:
            print("\nSuggested Agent: Social Media Strategist")
            print("Trigger: Activate Social Media Strategist to execute social media strategies.")
        elif "growth" in problem:
            print("\nSuggested Agent: Growth Hacker")
            print("Trigger: Activate Growth Hacker for user acquisition experiments.")
        else:
            print("\nNo direct match. Please list all agents using option '1'.")
    else:
        print("Invalid option. Restart the script.")

if __name__ == "__main__":
    main()
