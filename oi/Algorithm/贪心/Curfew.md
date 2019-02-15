# Curfew
[CF949D]

Instructors of Some Informatics School make students go to bed.  
The house contains n rooms, in each room exactly b students were supposed to sleep. However, at the time of curfew it happened that many students are not located in their assigned rooms. The rooms are arranged in a row and numbered from 1 to n. Initially, in i-th room there are ai students. All students are currently somewhere in the house, therefore a1 + a2 + ... + an = nb. Also 2 instructors live in this house.  
The process of curfew enforcement is the following. One instructor starts near room 1 and moves toward room n, while the second instructor starts near room n and moves toward room 1. After processing current room, each instructor moves on to the next one. Both instructors enter rooms and move simultaneously, if n is odd, then only the first instructor processes the middle room. When all rooms are processed, the process ends.  
When an instructor processes a room, she counts the number of students in the room, then turns off the light, and locks the room. Also, if the number of students inside the processed room is not equal to b, the instructor writes down the number of this room into her notebook (and turns off the light, and locks the room). Instructors are in a hurry (to prepare the study plan for the next day), so they don't care about who is in the room, but only about the number of students.  
While instructors are inside the rooms, students can run between rooms that are not locked and not being processed. A student can run by at most d rooms, that is she can move to a room with number that differs my at most d. Also, after (or instead of) running each student can hide under a bed in a room she is in. In this case the instructor will not count her during the processing. In each room any number of students can hide simultaneously.  
Formally, here is what's happening:  
    A curfew is announced, at this point in room i there are ai students.
    Each student can run to another room but not further than d rooms away from her initial room, or stay in place. After that each student can optionally hide under a bed.
    Instructors enter room 1 and room n, they count students there and lock the room (after it no one can enter or leave this room).
    Each student from rooms with numbers from 2 to n - 1 can run to another room but not further than d rooms away from her current room, or stay in place. Each student can optionally hide under a bed.
    Instructors move from room 1 to room 2 and from room n to room n - 1.
    This process continues until all rooms are processed.   
Let x1 denote the number of rooms in which the first instructor counted the number of non-hidden students different from b, and x2 be the same number for the second instructor. Students know that the principal will only listen to one complaint, therefore they want to minimize the maximum of numbers xi. Help them find this value if they use the optimal strategy.

贪心地想，如果某一个宿舍不管怎样都不能满足，那么干脆让学生往后面走。所以用一个前缀和来求区间和维护贪心。  
注意到如果是奇数的话，中间的房间一定能够满足，所以不用管中间的那一间。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int inf=2147483647;

int n;
ll d,B;
ll A[maxN],Sum[maxN];

int main(){
	scanf("%d%lld%lld",&n,&d,&B);
	for (int i=1;i<=n;i++) scanf("%lld",&A[i]),Sum[i]=Sum[i-1]+A[i];

	int cnt1=0,cnt2=0;
	for(int i=1;i<=n/2;i++){
		if (Sum[min((ll)n,i+i*d)]-B*cnt1>=B) cnt1++;
		if (Sum[n]-Sum[max(0ll,n-i-i*d)]-B*cnt2>=B) cnt2++;
	}
	
	printf("%d\n",max(n/2-cnt1,n/2-cnt2));return 0;
}
```