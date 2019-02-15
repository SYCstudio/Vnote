# An unavoidable detour for home
[CF814E]

Those unwilling to return home from a long journey, will be affected by the oddity of the snail and lose their way. Mayoi, the oddity's carrier, wouldn't like this to happen, but there's nothing to do with this before a cure is figured out. For now, she would only like to know the enormous number of possibilities to be faced with if someone gets lost.  
There are n towns in the region, numbered from 1 to n. The town numbered 1 is called the capital. The traffic network is formed by bidirectional roads connecting pairs of towns. No two roads connect the same pair of towns, and no road connects a town with itself. The time needed to travel through each of the roads is the same. Lost travelers will not be able to find out how the towns are connected, but the residents can help them by providing the following facts:  
    Starting from each town other than the capital, the shortest path (i.e. the path passing through the minimum number of roads) to the capital exists, and is unique;  
    Let li be the number of roads on the shortest path from town i to the capital, then li ≥ li - 1 holds for all 2 ≤ i ≤ n;
    For town i, the number of roads connected to it is denoted by di, which equals either 2 or 3.   
You are to count the number of different ways in which the towns are connected, and give the answer modulo 109 + 7. Two ways of connecting towns are considered different if a pair (u, v) (1 ≤ u, v ≤ n) exists such there is a road between towns u and v in one of them but not in the other.

对于一个 n 个点的简单无向图，要求每一个点到 1 的最短路唯一，并且最短路大小随着 i 的增加单调不降。现在给出每一个点的度数[2..3]，求合法的无向图个数。

把到 1 最短路相同的看作一组，那么根据题目的性质，每一个点必须向它前面的一组连边，剩下的边只能连自己所在的组或者是后面的组。那么设 F[i][a][b][c][d] 表示前 i 个点，第 i 个点所在的组有 c 个剩一条出边，有 d 个剩两条出边；前一组有 a 个剩一条出边，有 b 个剩两条出边。讨论第 i+1 个点的连边情况转移。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=52;
const int Mod=1e9+7;
const int inf=2147483647;

int n;
int Dg[maxN];
int F[2][maxN][maxN][maxN][maxN];

void Plus(int &x,int y);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Dg[i]);
	if (Dg[1]+1>n){
		printf("0\n");return 0;
	}
	if (Dg[1]==2){
		if (Dg[2]==2) F[2&1][1][0][1][0]=1;
		else F[2&1][1][0][0][1]=1;
	}
	else{
		if (Dg[2]==2) F[2&1][0][1][1][0]=1;
		else F[2&1][0][1][0][1]=1;
	}
	for (int i=2;i<n;i++){
		int now=i&1;
		mem(F[now^1],0);
		for (int a=0;a<=i;a++)
			for (int b=0;a+b<=i;b++)
				for (int c=0;c+a+b<=i;c++)
					for (int d=0;a+b+c+d<=i;d++){
						if (F[now][a][b][c][d]){
							int key=F[now][a][b][c][d];
							if (a>=1){
								if (Dg[i+1]==2){
									if (c>=1) Plus(F[now^1][a-1][b][c-1][d],1ll*key*a%Mod*c%Mod);
									if (d>=1) Plus(F[now^1][a-1][b][c+1][d-1],1ll*key*a%Mod*d%Mod);
									Plus(F[now^1][a-1][b][c+1][d],1ll*key*a%Mod);
								}
								else{
									if (c>=2) Plus(F[now^1][a-1][b][c-2][d],1ll*c*(c-1)/2%Mod*key%Mod*a%Mod);
									if (c>=1) Plus(F[now^1][a-1][b][c][d],1ll*key*a%Mod*c%Mod);
									if (d>=2) Plus(F[now^1][a-1][b][c+2][d-2],1ll*d*(d-1)/2%Mod*key%Mod*a%Mod);
									if (d>=1) Plus(F[now^1][a-1][b][c+2][d-1],1ll*key*a%Mod*d%Mod);
									if ((c>=1)&&(d>=1)) Plus(F[now^1][a-1][b][c][d-1],1ll*key*a%Mod*c%Mod*d%Mod);
									Plus(F[now^1][a-1][b][c][d+1],1ll*key*a%Mod);
								}
							}
							if (b>=1){
								if (Dg[i+1]==2){
									if (c>=1) Plus(F[now^1][a+1][b-1][c-1][d],1ll*key*b%Mod*c%Mod);
									if (d>=1) Plus(F[now^1][a+1][b-1][c+1][d-1],1ll*key*b%Mod*d%Mod);
									Plus(F[now^1][a+1][b-1][c+1][d],1ll*key*b%Mod);
								}
								else{
									if (c>=2) Plus(F[now^1][a+1][b-1][c-2][d],1ll*c*(c-1)/2%Mod*key%Mod*b%Mod);
									if (c>=1) Plus(F[now^1][a+1][b-1][c][d],1ll*key*b%Mod*c%Mod);
									if (d>=2) Plus(F[now^1][a+1][b-1][c+2][d-2],1ll*d*(d-1)/2%Mod*key%Mod*b%Mod);
									if (d>=1) Plus(F[now^1][a+1][b-1][c+2][d-1],1ll*key*b%Mod*d%Mod);
									if ((c>=1)&&(d>=1)) Plus(F[now^1][a+1][b-1][c][d-1],1ll*key*b%Mod*c%Mod*d%Mod);
									Plus(F[now^1][a+1][b-1][c][d+1],1ll*key*b%Mod);
								}
							}

							if ((a==0)&&(b==0)){
								if (Dg[i+1]==2){
									if (c>=1) Plus(F[now^1][c-1][d][1][0],1ll*key*c%Mod);
									if (d>=1) Plus(F[now^1][c+1][d-1][1][0],1ll*key*d%Mod);
								}
								else{
									if (c>=1) Plus(F[now^1][c-1][d][0][1],1ll*key*c%Mod);
									if (d>=1) Plus(F[now^1][c+1][d-1][0][1],1ll*key*d%Mod);
								}
							}
						}
					}
	}

	printf("%d\n",F[n&1][0][0][0][0]);

	return 0;
}

void Plus(int &x,int y){
	x=(x+y)%Mod;return;
}
```