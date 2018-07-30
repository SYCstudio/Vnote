# [Lydsy1712月赛]字符串的周期
[BZOJ5130]

按照最小表示法枚举字符串，然后$KMP$求$Next$算出周期。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=14;
const int Mod=998244353;
const int inf=2147483647;

int n,m;
int St[maxN],Next[maxN];
int Ans=0,Cnt[maxN];

void dfs(int depth,int limit);
int GetNext();

int main()
{
	scanf("%d%d",&n,&m);
	Cnt[0]=1;
	for (int i=1;i<=n;i++) Cnt[i]=1ll*Cnt[i-1]*(m-i+1)%Mod;
	dfs(1,0);
	printf("%d\n",Ans);
	return 0;
}

void dfs(int depth,int limit){
	if (depth>n){
		Ans=(Ans+1ll*Cnt[limit]*GetNext()%Mod)%Mod;
		return;
	}
	for (int i=1;i<=limit;i++){
		St[depth]=i;dfs(depth+1,limit);
	}
	St[depth]=limit+1;dfs(depth+1,limit+1);
	return;
}

int GetNext(){
	Next[0]=Next[1]=0;
	for (int i=2,j=0;i<=n;i++){
		while ((j!=0)&&(St[j+1]!=St[i])) j=Next[j];
		if (St[j+1]==St[i]) j++;
		Next[i]=j;
	}
	int ret=1;
	for (int i=1;i<=n;i++) ret=1ll*ret*(i-Next[i])%Mod;
	return ret;
}
```