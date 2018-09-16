# Garbage Collector
[AGC027B]

Snuke has decided to use a robot to clean his room.  
There are N pieces of trash on a number line. The i-th piece from the left is at position xi. We would like to put all of them in a trash bin at position 0.  
For the positions of the pieces of trash, 0 < x1 < x2 < … < xN ≤ 10^9 holds.  
The robot is initially at position 0. It can freely move left and right along the number line, pick up a piece of trash when it comes to the position of that piece, carry any number of pieces of trash and put them in the trash bin when it comes to position 0. It is not allowed to put pieces of trash anywhere except in the trash bin.  
The robot consumes X points of energy when the robot picks up a piece of trash, or put pieces of trash in the trash bin. (Putting any number of pieces of trash in the trash bin consumes X points of energy.) Also, the robot consumes (k+1)^2 points of energy to travel by a distance of 1 when the robot is carrying k pieces of trash.  
Find the minimum amount of energy required to put all the N pieces of trash in the trash bin.

直线上有 n 个物品，现在有一个机器人，它从 0 出发，要把所有的物品收集到 0 。物品只能在开始的地方被拾起，在 0 被放下。拾起一个物品或者放下一个物品的代价都是 X 。携带 K 个物品经过距离 1 的代价为 $(K+1) ^ 2$ ，求最小代价。

由于每一个物品都会被拾起一次，那么这个代价可以看作是常数。  
每一次机器人从 0 出发，收集某一个集合中的所有物品；那么当集合中的元素是确定的时候，不妨设为 X1,X2,X3...Xs ，根据贪心，一定是先一次走到这个集合中最右边的物品处，然后一边往回走一边收集，那么走空载第一遍的代价就是 1 * Xs。首先处理 $(K+1) ^ 2$ ，由于 $X^2=1+3+5+\dots$ ，那么也就是说往回走的时候，代价为 $X[s]+3X[s]+5X[s-1]+7X[s-2]+\dots$ ，再把前面空载的代价加上，就是 $5X[s]+5X[s-1]+7X[s-2]+9X[s-3]+\dots$ 。也就是说总代价为每一个距离乘上一个系数。那么假设枚举取 K 次，就有 2K 个 5， K 个 7 ，K 个 9... 根据贪心，让更远的点代价尽量小，那么就是一段一段地分配系数。计算一个取 K 次的复杂度是 n/K ，总复杂度就是 O(nlogn)

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ull unsigned long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=202000;
const int inf=2147483647;

int n;
ull X,Sum[maxN];

int main(){
	cin>>n>>X;
	for (int i=1;i<=n;i++){
		cin>>Sum[i];
		Sum[i]+=Sum[i-1];
	}

	ull Ans=Sum[n]*5+n*X;

	for (int K=1;K<n;K++){
		ull nowans=K*X;
		if (K*2>=n) nowans=nowans+5*Sum[n];
		else{
			nowans=nowans+5*(Sum[n]-Sum[n-2*K]);
			int lst=n-2*K;
			ull cost=7;
			while (lst>=K){
				nowans=nowans+cost*(Sum[lst]-Sum[lst-K]);
				cost+=2;lst-=K;
			}
			nowans=nowans+cost*Sum[lst];
		}
		Ans=min(Ans,nowans);
	}

	cout<<Ans+X*n<<endl;
	return 0;
}
```