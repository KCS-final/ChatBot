import os
from dotenv import load_dotenv
from openai import OpenAI

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 OpenAI API 키를 읽어옴
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OpenAI API key is missing. Please set it in the .env file.")

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=api_key)

# 어시스턴트 정보 가져오기
my_assistant = client.beta.assistants.retrieve("asst_2eLQK8JgQPNK6CA0NrDAQylW")
# print(my_assistant)

# 스레드 정보 가져오기
my_thread = client.beta.threads.retrieve("thread_s31hUT1Xf8V8zKiopU7fmr1w")
# print(my_thread)

# # 새로운 메시지를 스레드에 추가
# thread_message = client.beta.threads.messages.create(
#   "thread_s31hUT1Xf8V8zKiopU7fmr1w",  # 기존 스레드 ID
#   role="user",
#   content="안녕",
# )
# print(thread_message)

# run = client.beta.threads.runs.create(
#   thread_id="thread_s31hUT1Xf8V8zKiopU7fmr1w",
#   assistant_id="asst_2eLQK8JgQPNK6CA0NrDAQylW"
# )
# print(run)

# 제일 최신의 대답을 가져오기 위한 설정
run_steps = client.beta.threads.runs.steps.list(
    thread_id="thread_s31hUT1Xf8V8zKiopU7fmr1w",
    run_id="run_MPFL5yXPfaqQklhv9gMtWh56",
    limit=1,  # 한 개의 최신 대답만 가져옴
    order='desc'  # 최신 순으로 정렬
)

# run_steps에서 대답 내용을 추출하여 출력
if run_steps.data:
    latest_step = run_steps.data[0]
    message_creation = latest_step.step_details.message_creation
    message_id = message_creation.message_id
    
    # 메시지 내용을 가져오기 위한 추가 요청
    message = client.beta.threads.messages.retrieve(
        thread_id="thread_s31hUT1Xf8V8zKiopU7fmr1w",
        message_id=message_id
    )
    
    print(message.content)  # 메시지 내용 출력

else:
    print("No steps found")
