# Eat the Trees
[HDU1693 Luogu5074]

给出n*m的方格，有些格子不能铺线，其它格子必须铺，可以形成多个闭合回路。问有多少种铺法？

可以有多个连通块的回路问题，用二进制表示状态即可。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=12;
const int inf=2147483647;

int n,m;
int fob[maxN+5][maxN+5];
int now=0,scnt[2],Seq[2][9000],Pos[9000],tim,Tim[9000];
ll F[2][9000];

bool check(int x,int y);
void Plus(int S,ll key);

int main(){
	int TTT;scanf("%d",&TTT);
	for (int ti=1;ti<=TTT;ti++){
		scanf("%d%d",&n,&m);mem(fob,0);
		for (int i=1;i<=n;i++) for (int j=1;j<=m;j++) scanf("%d",&fob[i][j]);
		mem(F,0);mem(Seq,0);mem(scnt,0);
		now=0;scnt[now]=1;F[now][1]=1;++tim;
		for (int i=1;i<=n;i++)
			for (int j=1;j<=m;j++){
				now^=1;scnt[now]=0;++tim;
				for (int l=1;l<=scnt[now^1];l++){
					int S=Seq[now^1][l],x=S&1,y=(S>>j)&1;ll key=F[now^1][l];F[now^1][l]=0;
					if (fob[i][j]==0){
						if ((x==0)&&(y==0)) Plus(S,key);
						continue;
					}
					if (x==0){
						if (y==0){
							if (check(i+1,j)&&check(i,j+1)) Plus(S|1|(1<<j),key);
						}
						if (y==1){
							if (check(i+1,j)) Plus(S,key);
							if (check(i,j+1)) Plus((S^(1<<j))|1,key);
						}
					}
					if (x==1){
						if (y==0){
							if (check(i+1,j)) Plus((S^1)|(1<<j),key);
							if (check(i,j+1)) Plus(S,key);
						}
						if (y==1) Plus(S^1^(1<<j),key);
					}
				}
			}
		ll Ans=0;
		if (Tim[0]==tim) Ans=F[now][Pos[0]];
        //printf("Case %d: There are %lld ways to eat the trees.\n",ti,Ans);
		printf("%lld\n",Ans);
	}
	return 0;
}

bool check(int x,int y){
	return (x<=n)&&(y<=m)&&(fob[x][y]==1);
}

void Plus(int S,ll key){
	if (Tim[S]!=tim) Pos[Seq[now][++scnt[now]]=S]=scnt[now],Tim[S]=tim;
	F[now][Pos[S]]+=key;return;
}
```