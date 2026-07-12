def print_user_skills(username, *args):
    print(f"the person with {username} as username has these skills:")

    for i in args:
        return f"{username} has {args}"
    
val=print_user_skills("fijvgjb", "AWS", "docker", "terraform")

print(val)